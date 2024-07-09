import got from "got";
import { createWriteStream, readdir, readdirSync, lstatSync, rmdirSync, unlinkSync, existsSync, mkdirSync } from "fs";
import { pipeline } from "stream";
import { promisify } from "util";
import { unlink } from "fs/promises";
import { join } from "path";

const readdirAsync = promisify(readdir);
const adjustPath = (path: string) => `../../fixtures/${path}`;

export const downloadFile = ({ url, path, isTempFile }: { url: string; path: string; isTempFile?: boolean }) => {
    const fileDestinationPath = isTempFile ? `../../artifacts/temp/${path}` : adjustPath(path);
    const pipe = promisify(pipeline);
    return pipe(got.stream(url), createWriteStream(fileDestinationPath)).then(() => path);
};

export const removeDownloadedFile = (path: string) => unlink(adjustPath(path)).then(() => path);

export const getDownloads = async (downloadsFolder: string) => {
    const files = await readdirAsync(downloadsFolder);
    return files;
};

export const clearDownloadsFolder = (downloadsFolder: string) => {
    if (!existsSync(downloadsFolder)) {
        mkdirSync(downloadsFolder);
        return null;
    }

    readdirSync(downloadsFolder).forEach((file) => {
        const currentPath = join(downloadsFolder, file);
        if (lstatSync(currentPath).isDirectory()) {
            clearDownloadsFolder(currentPath);
            rmdirSync(currentPath);
        } else {
            unlinkSync(currentPath);
        }
    });
    return null;
};
