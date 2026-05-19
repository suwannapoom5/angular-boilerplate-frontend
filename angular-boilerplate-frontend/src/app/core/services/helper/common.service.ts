import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { saveAs } from 'file-saver';
import moment from 'moment';
import PhotoSwipe, { PhotoSwipeOptions } from 'photoswipe';

import { environment } from '../../../../environments/environment';
import { FileModel, FileTypes } from '../../../core/model/interface/file-model';
import { MasterDataApiService } from '../base-api/master-data-api.service';


@Injectable({
  providedIn: 'root',
})
export class CommonService {
  private pswp?: PhotoSwipe;

  secret_key: string = environment.SECRET_KEY;

  constructor(
    private apiService: MasterDataApiService,
  ) { }

  distinctArray<T>(arr: T[]): T[] {
    return [...new Set(arr)];
  }

  encrypt(value: string): string {
    return CryptoJS.AES.encrypt(value, this.secret_key.trim()).toString().trim();
  }

  decrypt(textToDecrypt: string): string {
    let result: string = '';

    try {
      result = CryptoJS.AES.decrypt(textToDecrypt, this.secret_key.trim()).toString(CryptoJS.enc.Utf8);

      return result;
    } catch (e) {
      return result;
    }
  }

  bytesToSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
  }

  isPropertyNullOrUndefined(value: any): boolean {
    return value === null || value === 'null' || value === undefined || value === '' || value === '00000000-0000-0000-0000-000000000000';
  }

  getUuidv4() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
      (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    );
  }

  getBahtText(num: any, suffix?: string): string {
    if (typeof suffix === 'undefined') {
      suffix = 'บาทถ้วน';
    }

    num = num || 0;
    num = num.toString().replace(/[, ]/g, ''); // remove commas, spaces

    if (isNaN(num) || (Math.round(parseFloat(num) * 100) / 100) === 0) {
      return 'ศูนย์บาทถ้วน';
    } else {

      let t = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน', 'ล้าน'],
        n = ['', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'],
        len,
        digit,
        text = '',
        parts,
        i;

      if (num.indexOf('.') > -1) {
        parts = num.toString().split('.');
        num = parts[0];
        parts[1] = parseFloat('0.' + parts[1]);
        parts[1] = (Math.round(parts[1] * 100) / 100).toString();
        parts = parts[1].split('.');

        if (parts.length > 1 && parts[1].length === 1) {
          parts[1] = parts[1].toString() + '0';
        }

        num = parseInt(num, 10) + parseInt(parts[0], 10);

        text = num ? this.getBahtText(num) : '';

        if (parseInt(parts[1], 10) > 0) {
          text = text.replace('ถ้วน', '') + this.getBahtText(parts[1], 'สตางค์');
        }

        return text;
      } else {
        if (num.length > 7) { // more than (or equal to) 10 millions

          let overflow = num.substring(0, num.length - 6);
          let remains = num.slice(-6);
          return this.getBahtText(overflow).replace('บาทถ้วน', 'ล้าน') + this.getBahtText(remains).replace('ศูนย์', '');

        } else {

          len = num.length;
          for (i = 0; i < len; i = i + 1) {
            digit = parseInt(num.charAt(i), 10);
            if (digit > 0) {
              if (len > 2 && i === len - 1 && digit === 1 && suffix !== 'สตางค์') {
                text += 'เอ็ด' + t[len - 1 - i];
              } else {
                text += n[digit] + t[len - 1 - i];
              }
            }
          }

          // grammar correction
          text = text.replace('หนึ่งสิบ', 'สิบ');
          text = text.replace('สองสิบ', 'ยี่สิบ');
          text = text.replace('สิบหนึ่ง', 'สิบเอ็ด');

          return text + suffix;
        }
      }
    }
  }

  base64ToBlob(base64: string, mime: string): Blob {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = Array.from(slice, char => char.charCodeAt(0));
      byteArrays.push(new Uint8Array(byteNumbers));
    }

    return new Blob(byteArrays, { type: mime });
  }

  blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        // result จะเป็น data:application/pdf;base64,xxxx
        const base64 = result.split(',')[1]; // เอาเฉพาะ base64
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  async viewImage(src: string, opts: Partial<PhotoSwipeOptions> = {}): Promise<void> {
    const mod = await import('photoswipe');
    const PhotoSwipeModule = mod.default;

    const getImageSize = (url: string): Promise<{ width: number; height: number }> => {
      return new Promise(resolve => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        (img as any).referrerPolicy = 'no-referrer';
        img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
        img.onerror = () => resolve({ width: 1600, height: 900 });
        img.src = url;
      });
    };

    const size = await getImageSize(src);
    let dataSource = {
      src: src,
      width: size.width,
      height: size.height,
    };

    this.pswp?.destroy();

    const options: Partial<PhotoSwipeOptions> = {
      dataSource: [dataSource],
      index: 0,
      mouseMovePan: true,
      initialZoomLevel: 'fit',
      secondaryZoomLevel: 1.5,
      wheelToZoom: true,
      bgOpacity: 0.9,
      padding: { top: 50, bottom: 50, left: 16, right: 16 },
      ...opts
    };

    this.pswp = new PhotoSwipeModule(options);

    // download button
    this.pswp.on('uiRegister', () => {
      this.pswp!.ui!.registerElement({
        name: 'download-button',
        order: 8,
        isButton: true,
        tagName: 'a',
        html: {
          isCustomSVG: true,
          inner:
            '<path d="M20.5 14.3 17.1 18V10h-2.2v7.9l-3.4-3.6L10 16l6 6.1 6-6.1ZM23 23H9v2h14Z" id="pswp__icn-download"/>',
          outlineID: 'pswp__icn-download'
        },
        onClick: () => {
          const curr = this.pswp?.currSlide?.data as any;
          if (!curr?.src) return;
          const a = document.createElement('a');
          a.href = curr.src;
          a.download = (curr.src.split('/').pop() || 'image.jpg').split('?')[0];
          a.click();
        }
      });
    });

    this.pswp.init();
  }


  prepareFormData_Body(json: any): FormData {
    const isFileLike = (x: any): x is File | Blob => {
      return x instanceof File || x instanceof Blob;
    }

    const isFileModel = (x: any): x is FileModel => {
      return x && typeof x === 'object' && isFileLike(x.blob);
    }

    let formData = new FormData()

    if (json) {
      Object.keys(json).forEach(key => {
        let value = json[key];
        if (isFileModel(value)) {
          if (value.blob && !value.file_id) {
            formData.append(key, value.blob!, value.file_name!);
          }

          value = null;
        } else if (Array.isArray(value) && value.every(isFileModel)) {
          value.forEach(x => {
            if (x.blob && !x.file_id) {
              formData.append(key, x.blob, x.file_name!);
            }
          })


        }
      });
    }

    formData.append('json_data', JSON.stringify(json))

    return formData
  }

  concealEmail(email: string): string {
    if (!email) return '-'

    // split the email into [localPart, domain]
    const [localPart, domain] = email.split('@');

    // build the masked local part
    let masked = '';
    for (let i = 0; i < localPart.length; i++) {
      masked += i <= 1 ? localPart[i] : '*';
    }

    return `${masked}@${domain}`;
  }

  formatBuddhistDate(dateString: string, format: string = 'DD-MM-YYYY'): string {
    if (!dateString) return '';
    const m = moment(dateString);
    if (!m.isValid()) return '';
    return m.add(543, 'year').format(format);
  }


  GetBlobFromFileModel(file: FileModel): Promise<Blob> {
    return new Promise((resolve, rejects) => {
      if (!file) {
        rejects()
        return
      }

      const extension = (file.file_extension || '').toLowerCase();
      const fileName = file.file_name || 'download';
      const mimeType =
        Object.entries(FileTypes.FileType).find(
          ([, value]) => value.endsWith(`/${extension}`) || value.includes(extension)
        )?.[1] || 'application/octet-stream';


      this.apiService.blob_get(`File/GetFile${file.file_path}`).subscribe({
        next: res => {
          if (res) {
            const blob = new Blob([res], { type: mimeType });
            resolve(blob)
          } else {
            rejects()
          }
        },
        error: err => {
          rejects()
          console.error(err);
        }
      });
    })
  }

  async downloadFileModel(file: FileModel): Promise<void> {
    return new Promise(async (resolve, rejects) => {

      if (!file) {
        rejects()
        return
      }

      let blob = await this.GetBlobFromFileModel(file)
      const extension = (file.file_extension || '').toLowerCase();
      const fileName = file.file_name || 'download';

      saveAs(blob, `${fileName}.${extension}`);
      resolve()
    })
  }

  openFile(file: FileModel) {
    const extension = file.file_extension?.toLowerCase() || '';
    const fileName = file.file_name || 'download';

    // Map file extension to MIME type
    const extToMime = new Map<string, string>();
    Object.entries(FileTypes.FileType).forEach(([_, mime]) => {
      const ext = mime.split('/')[1]?.split('.')[0];
      if (ext) extToMime.set(ext, mime);
    });
    extToMime.set('jpg', FileTypes.FileType.JPG); // Handle 'jpg'

    const mimeType = extToMime.get(extension) || 'application/octet-stream';

    if (file.base64) {
      // New file (from upload)
      const blob = this.base64ToBlob(file.base64, mimeType);
      const url = URL.createObjectURL(blob);

      let isUseProtectedURL = false
      this.openByType(url, mimeType, `${fileName}.${extension}`, isUseProtectedURL);
    } else if (file.file_path) {
      // Existing file (from server)
      // Assume file_path is a full URL or relative path handled by the browser

      let isUseProtectedURL = true
      this.openByType(file.file_path, mimeType, `${fileName}.${extension}`, isUseProtectedURL);
    } else {
      console.error("Invalid file data: no base64 or file_path");
    }
  }

  private openByType(url: string, mimeType: string, downloadName: string, isUseProtectedURL: boolean) {
    if (FileTypes.AllImageTypes.includes(mimeType as FileTypes.FileType) || mimeType === FileTypes.FileType.PDF) {
      // console.log(isUseProtectedURL ? environment.PROTECTED_FILE_PATH + url : environment.WEB_BASE_URL + '/' + url)
      window.open(isUseProtectedURL ? environment.PROTECTED_FILE_PATH + url : url, '_blank');

    } else {
      const a = document.createElement('a');
      a.href = url;
      a.download = downloadName;
      a.click();
      if (url.startsWith('blob:')) {
        URL.revokeObjectURL(url); // Clean up if blob
      }
    }
  }

  convertArabicNumberToThaiNumber(input: string | number): string {
    if (input === null || input === undefined) return '';

    const thaiDigits = ['๐', '๑', '๒', '๓', '๔', '๕', '๖', '๗', '๘', '๙'];

    return input
      .toString()
      .replace(/\d/g, (digit) => thaiDigits[parseInt(digit, 10)]);
  }

  convertThaiNumberToArabicNumber(input: string): string {
    const thaiToArabic: Record<string, string> = {
      '๐': '0', '๑': '1', '๒': '2', '๓': '3', '๔': '4',
      '๕': '5', '๖': '6', '๗': '7', '๘': '8', '๙': '9'
    };

    return input.replace(/[๐-๙]/g, (d) => thaiToArabic[d]);
  }




}
