export interface UserFilePersistenceService {
    saveDataToFile():string;
    restoreDataFromFile():string;
}