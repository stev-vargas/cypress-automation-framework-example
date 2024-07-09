import * as jwt from "jsonwebtoken";

export const encodeJwt = (params: { data: any; secret: string; activeKey: string }) => {
    const { data, secret, activeKey } = params;

    try {
        const date = new Date();
        date.setDate(date.getDate() + 30);
        data.exp = Math.floor(date.getTime() / 1000);
        const options: jwt.SignOptions = { keyid: activeKey, algorithm: "RS256" };
        return jwt.sign(data, secret, options);
    } catch (err) {
        return err;
    }
};

export const decodeJwt = (params: { token: string; secret: string }) => {
    const { token, secret } = params;

    try {
        return jwt.verify(token, secret);
    } catch (err) {
        return err;
    }
};
