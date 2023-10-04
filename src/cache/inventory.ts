import * as path from 'path';
import * as fs from 'fs';
import * as cache from '@actions/cache';
import * as core from '@actions/core';
import * as glob from '@actions/glob';

const INVENTORY_CACHE_KEY = 'volta-inventory';

function getInventoryPath(voltaHome: string): string {
    return path.join(voltaHome, 'tools', 'inventory');
}

function getImagePath(voltaHome: string): string {
    return path.join(voltaHome, 'tools', 'image');
}

export async function restoreInventory(voltaHome: string): Promise<void> {
    core.debug('Trying to restore inventory.');
    const paths = [getInventoryPath(voltaHome)];
    const cacheKey = await cache.restoreCache(paths, INVENTORY_CACHE_KEY);
    if (cacheKey != null) {
        core.info('Successfully restored inventory.');
    } else {
        core.info('Could not restore inventory.');
    }
}

interface Tool {
    name: string;
    version: string;
}

function collectInstalledTools(voltaHome: string): Tool[] {
    const imagePath = getImagePath(voltaHome);
    return fs
        .readdirSync(imagePath, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .flatMap((entry) =>
            fs
                .readdirSync(path.join(imagePath, entry.name), { withFileTypes: true })
                .filter((subEntry) => subEntry.isDirectory())
                .map(
                    (subEntry) =>
                        ({
                            name: entry.name,
                            version: subEntry.name,
                        } satisfies Tool),
                ),
        );
}

function createToolFilePatter(tool: Tool): string {
    switch (tool.name) {
        case 'node':
        case 'yarn':
            return `${ tool.name }-v${ tool.version }*`;
        default:
            return `${ tool.name }-${ tool.version }*`;
    }
}

async function cleanInventory(voltaHome: string, installedTools: Tool[]): Promise<void> {
    core.info('Cleaning inventory');
    const inventoryPath = getInventoryPath(voltaHome);
    const toolExclusionPatterns = installedTools.map((tool) => {
        const filePattern = createToolFilePatter(tool);
        const filePath = path.join(inventoryPath, tool.name, filePattern);
        return `!${ filePath }`;
    });
    const patterns = [`${ inventoryPath }/**`, ...toolExclusionPatterns];
    const globber = await glob.create(patterns.join('\n'), { matchDirectories: false });
    const files = await globber.glob();
    for (const file of files) {
        try {
            core.debug(`Removing unused inventory entry: ${ file }`);
            fs.rmSync(file);
        } catch (e) {
            core.warning(
                `Problem occurred while cleaning the inventory for caching. Could not remove file '${ file }'.\n${ e }`,
            );
        }
    }
}

async function calculateCacheKey(voltaHome: string): Promise<string> {
    const inventoryPath = getInventoryPath(voltaHome);
    const hash = await glob.hashFiles(`${inventoryPath}/**`, voltaHome);
    return `${INVENTORY_CACHE_KEY}-${hash}`;
}

export async function cacheInventory(voltaHome: string): Promise<void> {
    core.info('Caching inventory');
    const installedTools = collectInstalledTools(voltaHome);
    core.info(`Found ${ installedTools.length } installed tools to cache.`);
    core.debug(installedTools.map((tool) => `${ tool.name }-${ tool.version }`).join(', '));

    // remove unused tools from the inventory, to keep the cache small
    await cleanInventory(voltaHome, installedTools);

    const paths = [getInventoryPath(voltaHome)];
    const cacheKey = await calculateCacheKey(voltaHome);
    try {
        await cache.saveCache(paths, cacheKey);

        core.info('Inventory successfully cached');
    } catch (e) {
        core.warning(`Failed to cache inventory.\n${e}`);
    }
}
