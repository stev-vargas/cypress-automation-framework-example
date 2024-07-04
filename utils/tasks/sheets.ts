import path from "path";
import xlsx from "xlsx";
import fs from "fs-extra";

const genFileDir = async (useFixTuresTempDir?: boolean) => {
    const dir = path.join("..", "..", useFixTuresTempDir ? "fixtures" : "artifacts", "temp");
    if (!fs.exists(dir)) {
        await fs.mkdir(dir);
    }
    return dir;
};

export const genXlsx = async ({
    name,
    sheetName,
    data,
    useFixTuresTempDir,
}: {
    name: string;
    sheetName?: string;
    data: Record<string, string | number | boolean>[];
    useFixTuresTempDir?: boolean;
}) => {
    const worksheet = xlsx.utils.json_to_sheet(data);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, sheetName);
    const filename = /\.xlsx$/i.test(name) ? name : `${name}.xlsx`;
    const dir = await genFileDir(useFixTuresTempDir);
    const filePath = path.join(dir, filename);
    await xlsx.writeFileXLSX(workbook, filePath);
    return filePath;
};

export const genCsv = async ({
    name,
    data,
    useCsvExtension = true,
    useFixTuresTempDir = false,
}: {
    name: string;
    data: { [key: string]: string | number | boolean }[];
    useCsvExtension?: boolean;
    useFixTuresTempDir?: boolean;
}) => {
    const csv: string[] = [];
    const keys = Object.keys(data[0]);
    csv.push(keys.join(","));
    data.forEach((entry) => {
        const line: string[] = [];
        keys.forEach((key) => {
            const cell = entry[key];
            line.push(typeof cell === "string" ? cell : cell.toString());
        });
        csv.push(line.join(","));
    });
    const filename = /\.csv$/i.test(name) ? name : `${name}.${useCsvExtension ? "csv" : "txt"}`;
    const dir = await genFileDir(useFixTuresTempDir);
    let filePath = path.join(dir, filename);
    fs.writeFileSync(filePath, csv.join("\n"));
    if (useFixTuresTempDir === true) {
        filePath = path.join("temp", filename);
    }
    return filePath;
};
