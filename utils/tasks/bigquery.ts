import { BigQuery } from "@google-cloud/bigquery";

const getClient = () =>
    new BigQuery({
        projectId: "ls-b2b-analytics-sbx",
    });

export const getBQTable = async (params: { datasetId: string; tableId: string }) => {
    const bigquery = getClient();
    const { datasetId, tableId } = params;

    const dataset = bigquery.dataset(datasetId);
    const table = await dataset.table(tableId).getRows();
    return table[0];
};

export const queryBQTable = async (queryStr: string) => {
    const bigquery = getClient();
    return bigquery.query(queryStr).then((resData) => {
        return resData;
    });
};
