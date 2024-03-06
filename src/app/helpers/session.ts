import { PaginationConfig } from "./pagination-config";

export class Session {
    homePaginationConfig: PaginationConfig = {} as PaginationConfig;
    companyPaginationConfig: PaginationConfig = {} as PaginationConfig;
    projectPaginationConfig: PaginationConfig = {} as PaginationConfig;
    homeCriteria: string;
    companyCriteria: string;
    projectCriteria: string;
    companyId: string;
    projectId: string;
    findingId:string;

  constructor() {
    this.homePaginationConfig = new PaginationConfig();
    this.companyPaginationConfig = new PaginationConfig();
    this.projectPaginationConfig = new PaginationConfig();
    this.homeCriteria = '';
    this.companyCriteria = '';
    this.projectCriteria = '';
    this.companyId = '';
    this.projectId = '';
    this.findingId = '';
  }

  public reset() {
    this.homePaginationConfig.currentPage = 0;
    this.homePaginationConfig.itemsPerPage = 0;
    this.homePaginationConfig.numberOfPages = 0;
    this.homePaginationConfig.totalItems = 0;
    this.homePaginationConfig.autoHide = false;
    this.homeCriteria = '';
    this.companyCriteria = '';
    this.projectCriteria = '';

    this.companyId = '';
    this.projectId = '';
    this.findingId = '';

    this.companyPaginationConfig.currentPage = 0;
    this.companyPaginationConfig.itemsPerPage = 0;
    this.companyPaginationConfig.numberOfPages = 0;
    this.companyPaginationConfig.totalItems = 0;
    this.companyPaginationConfig.autoHide = false;
    this.companyCriteria = '';
    this.companyCriteria = '';
    this.projectCriteria = '';

    this.projectPaginationConfig.currentPage = 0;
    this.projectPaginationConfig.itemsPerPage = 0;
    this.projectPaginationConfig.numberOfPages = 0;
    this.projectPaginationConfig.totalItems = 0;
    this.projectPaginationConfig.autoHide = false;
    this.projectCriteria = '';
    this.companyCriteria = '';
    this.projectCriteria = '';
  }

}
