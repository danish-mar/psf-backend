import * as Minio from 'minio';
import dotenv from 'dotenv';

dotenv.config();

interface MinioConfig {
    endPoint: string,
    port: number,
    useSSL: boolean,
    accessKey: string,
    secretKey: string,
}


const minioConfig: MinioConfig = {
    endPoint: process.env.MINIO_ENDPOINT || 'http://localhost:3000',
    port: parseInt(process.env.MINIO_PORT || '127.0.0.1'),
    useSSL: process.env.MINIO_USE_SSL === 'true',
    accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
    secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
}

export const minioClient = new Minio.Client(minioConfig);

