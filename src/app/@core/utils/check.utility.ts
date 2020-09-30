export  class Check{

    public static isNull(item: any): boolean {

        if (item === undefined ||
            item === null) {
            return true;
        }
        return false;

    }
    public static isNullOrEmpty(item: any): boolean {

        if (item === undefined ||
            item === null ||
            item == "" ||
            (this.isArray(item) && item.length === 0)) {
            return true;
        }
        return false;

    }
    
    public static isArray(item: any): boolean {

        if (Array.isArray(item)) {
            return true;
        }
        return false; 
    } 

    public static hasKey(item: any, key: string): boolean {
        if(this.isNull(item)){
            return false;
        }

        if (this.isArray(item) &&
            item.length > 0) {
            return Object.keys(item[0]).indexOf(key) >= 0;
        }
        return Object.keys(item).indexOf(key) >= 0;
    }
}