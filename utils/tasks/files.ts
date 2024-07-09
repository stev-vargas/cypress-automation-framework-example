import * as fs from "fs-extra";

export const readOrCreateFile = (params: { path: string; defaultContent?: string }) => {
    const { path, defaultContent } = params;
    if (fs.existsSync(path)) {
        return fs.readFileSync(path);
    }

    fs.outputFileSync(path, defaultContent || "");
    return null;
};

export const deleteFile = (path: string) => {
    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
    }
    return null;
};
