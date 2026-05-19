export interface MenuItem {
    menu_id: number,
    name: string,
    sub_menu: MenuItem[] | null
    icon_name: string | null
    navigation_path: string | null
}