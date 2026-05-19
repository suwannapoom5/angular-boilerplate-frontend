import { ActivatedRoute, Router } from '@angular/router';

import { jwtDecode } from "jwt-decode";
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';


import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../../environments/environment';
import { AcceptConsentModalComponent } from '../../../shared/components/accept-consent-modal/accept-consent-modal.component';
import { MasterDataApiService } from '../base-api/master-data-api.service';
import { CommonService } from '../helper/common.service';

type UserCredential = any
type MenuAndPermission = any
type UserStatus = any

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUser = new BehaviorSubject<UserCredential | null>(null);
    private menuAndPermission = new BehaviorSubject<MenuAndPermission[] | null>(null);
    private userStatus = new BehaviorSubject<UserStatus | null>(null);

    currentUser$ = this.currentUser.asObservable();
    menuAndPermission$ = this.menuAndPermission.asObservable();
    userStatus$ = this.userStatus.asObservable();

    constructor(
        private apiService: MasterDataApiService,
        private commonService: CommonService,
        private route: ActivatedRoute,
        private toast: ToastrService,
        private router: Router,
        private dialog: NgbModal,
    ) {

    }

    login(body: {
        user_id: string,
        password: string
    }): Promise<void> {
        return new Promise((resolve, reject) => {
            this.apiService.post<{ token: string }>('Authen/Login', body).subscribe({
                next: async (res) => {
                    if (res.body?.data) {
                        this.setUserToken(res.body.data.token);
                        await this.getMenuAndPermission();
                        //await this.checkUserStatus()
                        resolve();
                    } else {
                        reject()
                    }
                }, error: err => {
                    console.error(err);
                    reject(err);
                }
            });
        });
    }


    logout(): void {
        sessionStorage.clear();
        this.currentUser.next(null);
    }

    setUserProfile(user: UserCredential) {
        this.currentUser.next(user);
    }

    setUserToken(token: string) {
        sessionStorage.setItem('userData', token)
        // this.getUserCredential()
        // this.checkUserStatus()
    }

    getUserToken(): string | null {
        return sessionStorage.getItem('userData') || null
    }

    async isLoggedin(): Promise<boolean> {
        // if (!this.getUserToken() || !this.getUserCredential()) {
        //     return false;
        // }

        // if (!this.menuAndPermission.value) {
        //     await this.getMenuAndPermission();
        // }

        return true;
    }

    getUserCredential(): UserCredential | null {


        let decrypt_token = this.getUserToken();
        if (!decrypt_token || decrypt_token == 'null' || decrypt_token == 'undefined') return null;

        let decode_token: any = jwtDecode(decrypt_token);
        try {
            // let tmp = JSON.parse(decode_token['credential_data']);
            // tmp.user_role_id = 3
            // console.log(tmp)
            // return tmp
            return JSON.parse(decode_token['credential_data']);
        } catch (error) {
            return null
        }
    }

    setMenuAndPermission(menuAndPermission: MenuAndPermission[]) {
        this.menuAndPermission.next(menuAndPermission)
    }

    setUserStatus(userStatus: UserStatus) {
        this.userStatus.next(userStatus);
    }

    getUserStatus(): UserStatus | null {
        return this.userStatus.value;
    }


    redirectToThaiD(redirect_uri: string) {
        let response_type = 'code';
        let client_id = environment.thaid_client_id;
        let scope = 'pid title name given_name family_name address birthdate openid house_address';
        let state = 'test';
        window.location.href = `${environment.thaid_auth_url}?response_type=${response_type}&client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}&state=${state}`;
    }

    getMenuAndPermission(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.apiService.get<MenuAndPermission[]>('User/GetUserMenuAndPermission').subscribe({
                next: async (res) => {
                    if (res.body?.data) {
                        this.setMenuAndPermission(res.body.data)
                        if (!this.userStatus.value) {
                            await this.checkUserStatus();
                        }
                        resolve();
                    } else {
                        reject();
                    }
                }, error: err => {
                    reject();
                    console.error(err)
                }
            })
        })

    }

    checkPermission(
        menu_id: number,
        permission_type: number,
    ): boolean {
        let menu_item = this.menuAndPermission.getValue()?.find(item => item.user_menu_id === menu_id);

        if (!menu_item) {
            return false;
        }

        return menu_item[`status_${permission_type}`]
    }

    checkUserStatus() {
        this.apiService.get<UserStatus>('Authen/CheckUserStatus').subscribe({
            next: res => {
                if (res.body?.data) {
                    this.setUserStatus(res.body.data);

                    if (!res.body.data.isCurrentConsent) {
                        this.openAcceptConsentModal()
                    }

                    // if (!res.body.data.isUpdateProfile) {
                    //     this.openUpdateProfileModal()
                    // }
                }
            }, error: err => {
                console.error(err)
            }
        })
    }

    openAcceptConsentModal() {
        let dialog = this.dialog.open(AcceptConsentModalComponent, {
            centered: true,
            backdrop: 'static',
            size: 'lg'
        });
    }


}
