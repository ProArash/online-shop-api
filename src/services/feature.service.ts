import { prismaClient } from "../utils/prisma-client";

export const featureService = {
    getFeatureByProductId: async (pid: number) => {
        return await prismaClient().feature.findMany({
            where: {
                product_id: pid,
            },
        });
    },
    newFeature: async (key: string, value: string, pid: number) => {
        return await prismaClient().feature.create({
            data: {
                key,
                value,
                product_id: pid,
            },
        });
    },
    updateFeatureById: async (
        key: string,
        value: string,
        pid: number,
        fid: number
    ) => {
        return await prismaClient().feature.update({
            data: {
                key,
                value,
            },
            where: {
                id: fid,
                product_id: pid,
            },
        });
    },
};
