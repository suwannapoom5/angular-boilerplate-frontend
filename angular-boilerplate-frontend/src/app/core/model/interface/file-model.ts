export namespace FileTypes {
    /**
     * Enum for common file MIME types.
     */
    export enum FileType {
        // Images
        PNG = 'image/png',
        JPEG = 'image/jpeg',
        JPG = 'image/jpg',
        GIF = 'image/gif',
        WEBP = 'image/webp',
        SVG = 'image/svg+xml',
        BMP = 'image/bmp',
        TIFF = 'image/tiff',
        HEIC = 'image/heic',

        // Documents
        PDF = 'application/pdf',
        DOC = 'application/msword',
        DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        TXT = 'text/plain',
        RTF = 'application/rtf',
        ODT = 'application/vnd.oasis.opendocument.text',
        MD = 'text/markdown',

        // Spreadsheets
        XLS = 'application/vnd.ms-excel',
        XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        CSV = 'text/csv',
        ODS = 'application/vnd.oasis.opendocument.spreadsheet',

        // Presentations
        PPT = 'application/vnd.ms-powerpoint',
        PPTX = 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        ODP = 'application/vnd.oasis.opendocument.presentation',

        // Archives & Packages
        ZIP = 'application/zip',
        RAR = 'application/vnd.rar',
        _7Z = 'application/x-7z-compressed',
        TAR = 'application/x-tar',
        GZ = 'application/gzip',

        // Audio
        MP3 = 'audio/mpeg',
        WAV = 'audio/wav',
        OGG = 'audio/ogg',
        FLAC = 'audio/flac',
        AAC = 'audio/aac',

        // Video
        MP4 = 'video/mp4',
        MOV = 'video/quicktime',
        AVI = 'video/x-msvideo',
        MKV = 'video/x-matroska',
        WMV = 'video/x-ms-wmv',
        WEBM = 'video/webm',

        // Code / Text formats
        HTML = 'text/html',
        CSS = 'text/css',
        JS = 'text/javascript',
        TS = 'application/typescript',
        JSON = 'application/json',
        XML = 'application/xml',
        YAML = 'application/x-yaml',
    }

    /**
     * Maps MIME types to user-friendly display names (e.g., 'PDF', 'PNG').
     */
    export const FileTypeDisplay: Map<FileType, string> = new Map([
        // Images
        [FileType.PNG, 'PNG'],
        [FileType.JPEG, 'JPEG'],
        [FileType.JPG, 'JPG'],
        [FileType.GIF, 'GIF'],
        [FileType.WEBP, 'WEBP'],
        [FileType.SVG, 'SVG'],
        [FileType.BMP, 'BMP'],
        [FileType.TIFF, 'TIFF'],
        [FileType.HEIC, 'HEIC'],

        // Documents
        [FileType.PDF, 'PDF'],
        [FileType.DOC, 'DOC'],
        [FileType.DOCX, 'DOCX'],
        [FileType.TXT, 'TXT'],
        [FileType.RTF, 'RTF'],
        [FileType.ODT, 'ODT'],
        [FileType.MD, 'MD'],

        // Spreadsheets
        [FileType.XLS, 'XLS'],
        [FileType.XLSX, 'XLSX'],
        [FileType.CSV, 'CSV'],
        [FileType.ODS, 'ODS'],

        // Presentations
        [FileType.PPT, 'PPT'],
        [FileType.PPTX, 'PPTX'],
        [FileType.ODP, 'ODP'],

        // Archives
        [FileType.ZIP, 'ZIP'],
        [FileType.RAR, 'RAR'],
        [FileType._7Z, '7Z'],
        [FileType.TAR, 'TAR'],
        [FileType.GZ, 'GZ'],

        // Audio
        [FileType.MP3, 'MP3'],
        [FileType.WAV, 'WAV'],
        [FileType.OGG, 'OGG'],
        [FileType.FLAC, 'FLAC'],
        [FileType.AAC, 'AAC'],

        // Video
        [FileType.MP4, 'MP4'],
        [FileType.MOV, 'MOV'],
        [FileType.AVI, 'AVI'],
        [FileType.MKV, 'MKV'],
        [FileType.WMV, 'WMV'],
        [FileType.WEBM, 'WEBM'],

        // Code / Text
        [FileType.HTML, 'HTML'],
        [FileType.CSS, 'CSS'],
        [FileType.JS, 'JS'],
        [FileType.TS, 'TS'],
        [FileType.JSON, 'JSON'],
        [FileType.XML, 'XML'],
        [FileType.YAML, 'YAML'],
    ]);

    // --- Category Arrays ---
    export const AllFileTypes: FileType[] = Object.values(FileType) as FileType[];
    export const UploadDriveTypes: FileType[] = [FileType.DOC, FileType.DOCX, FileType.PDF, FileType.XLS, FileType.XLSX, FileType.JPEG, FileType.JPG, FileType.PPT, FileType.MP4, FileType.MP3, FileType.GIF, FileType.TIFF];
    export const GeneralTypes: FileType[] = [FileType.DOC, FileType.DOCX, FileType.PDF, FileType.XLS, FileType.XLSX, FileType.JPEG, FileType.JPG, FileType.PNG, FileType.GIF, FileType.TIFF];

    export const AllImageTypes: FileType[] = [FileType.PNG, FileType.JPEG, FileType.JPG, FileType.GIF, FileType.WEBP, FileType.SVG, FileType.BMP];
    export const AllDocumentTypes: FileType[] = [FileType.PDF, FileType.DOC, FileType.DOCX, FileType.TXT, FileType.RTF, FileType.ODT];
    export const AllSpreadsheetTypes: FileType[] = [FileType.XLS, FileType.XLSX, FileType.CSV, FileType.ODS];
    export const AllPresentationTypes: FileType[] = [FileType.PPT, FileType.PPTX, FileType.ODP];
    export const AllArchiveTypes: FileType[] = [FileType.ZIP, FileType.RAR];

}

export interface FileModel {
    file_id?: string | null; // มาเปลี่ยนตัวนี้ด้วยน้าาาา
    file_name: string | null;
    file_path: string | null;
    file_extension: string | null;
    file_size: number | null;
    create_date?: string | null;
    base64?: string | null;
    blob?: Blob | null;
}