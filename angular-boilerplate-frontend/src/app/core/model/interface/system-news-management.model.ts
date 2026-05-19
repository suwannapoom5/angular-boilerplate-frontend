export interface AnnouncementItem {
  announcement_id: number;
  announcement_name: string;
  announcement_type: number;
  display_flag: boolean;
  created_date?: string;
}

export interface AreaOption {
  province_id: number;
  province_name: string;
  districts: DistrictOption[];
}

export interface DistrictOption {
  district_id: number;
  district_name: string;
}

export interface RegionOption {
  region_id: number;
  region_name: string;
  provinces: AreaOption[];
}

export interface GetAnnouncementPayload {
  limit: number;
  offset: number;
  search?: string;
  announcement_type?: number;
  display_flag?: boolean | null;
}

export interface GetAnnouncementResult {
  total_item: number;
  data: AnnouncementItem[];
}

export interface CreateAnnouncementPayload {
  announcement_name: string;
  announcement_type: number;
  announcement_access_rights: number[];
  announcement_region_department: string;
  announcement_start_date: string | null;
  announcement_time_start: string | null;
  announcement_end_date: string | null;
  announcement_time_end: string | null;
  announcement_description: string;
  display_flag: boolean;
  created_by: number;
  document?: {
    seq: number;
    current_file_path: string;
    file_base64: string;
    file_path: string;
    file_original_name: string;
    file_type: string;
    file_size: number;
  };
}

export interface UpdateAnnouncementPayload {
  announcement_id: number;
  announcement_name: string;
  announcement_type: number;
  announcement_access_rights: number[];
  announcement_region_department: string;
  announcement_start_date: string | null;
  announcement_time_start: string | null;
  announcement_end_date: string | null;
  announcement_time_end: string | null;
  announcement_description: string;
  display_flag: boolean;
  updated_by: number;
  document?: {
    seq: number;
    current_file_path: string;
    file_base64: string;
    file_path: string;
    file_original_name: string;
    file_type: string;
    file_size: number;
  };
}

export interface AnnouncementDocument {
  seq: number;
  current_file_path: string;
  file_base64: string | null;
  file_path: string;
  file_original_name: string;
  file_type: string;
  file_size: number;
}

export interface AnnouncementDetail {
  announcement_id: number;
  announcement_name: string;
  announcement_type: number;
  announcement_access_rights: number[] | string | null;
  announcement_region_department: number[] | string | null;
  announcement_start_date: string | null;
  announcement_time_start: string | null;
  announcement_end_date: string | null;
  announcement_time_end: string | null;
  announcement_description: string;
  display_flag: boolean;
  document?: AnnouncementDocument | null;
}

export interface DeleteAnnouncementPayload {
  announcement_ids: number[];
  deleted_by: number;
}
