import { Injectable } from '@angular/core';
import { Session } from '../helpers/session';
import { PaginationConfig } from '../helpers/pagination-config';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private static session: Session = new Session();

  constructor() { }

  public save() {
    localStorage.setItem('session', JSON.stringify(SessionService.session));
  }

  public retrieve() {
    let str = localStorage.getItem('session');
    if (str != null) {
      SessionService.session = JSON.parse(str);
    }
  }

  public resetSessionData() {
    //localStorage.removeItem('sesion');
    //SessionService.session.reset();

    SessionService.session.homePaginationConfig.currentPage = 0;
    SessionService.session.homePaginationConfig.itemsPerPage = 0;
    SessionService.session.homePaginationConfig.numberOfPages = 0;
    SessionService.session.homePaginationConfig.totalItems = 0;
    SessionService.session.homePaginationConfig.autoHide = false;
    SessionService.session.homeCriteria = '';
    SessionService.session.companyCriteria = '';
    SessionService.session.projectCriteria = '';

    SessionService.session.companyId = '';
    SessionService.session.projectId = '';
    SessionService.session.findingId = '';

    SessionService.session.companyPaginationConfig.currentPage = 0;
    SessionService.session.companyPaginationConfig.itemsPerPage = 0;
    SessionService.session.companyPaginationConfig.numberOfPages = 0;
    SessionService.session.companyPaginationConfig.totalItems = 0;
    SessionService.session.companyPaginationConfig.autoHide = false;
    SessionService.session.companyCriteria = '';
    SessionService.session.companyCriteria = '';
    SessionService.session.projectCriteria = '';

    SessionService.session.projectPaginationConfig.currentPage = 0;
    SessionService.session.projectPaginationConfig.itemsPerPage = 0;
    SessionService.session.projectPaginationConfig.numberOfPages = 0;
    SessionService.session.projectPaginationConfig.totalItems = 0;
    SessionService.session.projectPaginationConfig.autoHide = false;
    SessionService.session.projectCriteria = '';
    SessionService.session.companyCriteria = '';
    SessionService.session.projectCriteria = '';
  }

  public resetHomeSessionData() {
    //localStorage.removeItem('sesion');
    //SessionService.session.reset();

    SessionService.session.homePaginationConfig.currentPage = 0;
    SessionService.session.homePaginationConfig.itemsPerPage = 0;
    SessionService.session.homePaginationConfig.numberOfPages = 0;
    SessionService.session.homePaginationConfig.totalItems = 0;
    SessionService.session.homePaginationConfig.autoHide = false;
    SessionService.session.homeCriteria = '';
  }

  public resetCompanySessionData() {
    //localStorage.removeItem('sesion');
    //SessionService.session.reset();

    SessionService.session.companyCriteria = '';

    SessionService.session.companyId = '';

    SessionService.session.companyPaginationConfig.currentPage = 0;
    SessionService.session.companyPaginationConfig.itemsPerPage = 0;
    SessionService.session.companyPaginationConfig.numberOfPages = 0;
    SessionService.session.companyPaginationConfig.totalItems = 0;
    SessionService.session.companyPaginationConfig.autoHide = false;
  }

  public resetProjectSessionData() {
    //localStorage.removeItem('sesion');
    //SessionService.session.reset();

    SessionService.session.projectId = '';

    SessionService.session.projectCriteria = '';

    SessionService.session.projectPaginationConfig.currentPage = 0;
    SessionService.session.projectPaginationConfig.itemsPerPage = 0;
    SessionService.session.projectPaginationConfig.numberOfPages = 0;
    SessionService.session.projectPaginationConfig.totalItems = 0;
    SessionService.session.projectPaginationConfig.autoHide = false;
  }

  public resetFindingSessionData() {
    //localStorage.removeItem('sesion');
    //SessionService.session.reset();

    SessionService.session.findingId = '';
  }
  /*
  public getSession() {
    return SessionService.session;
  }
  */
  public getHomeConfig(pagConfig: PaginationConfig, criteria: any) {
    pagConfig.autoHide = SessionService.session.homePaginationConfig.autoHide;
    pagConfig.currentPage = SessionService.session.homePaginationConfig.currentPage;
    pagConfig.itemsPerPage = SessionService.session.homePaginationConfig.itemsPerPage;
    pagConfig.numberOfPages = SessionService.session.homePaginationConfig.numberOfPages;
    pagConfig.totalItems = SessionService.session.homePaginationConfig.totalItems;
    criteria.str = SessionService.session.homeCriteria;
  }

  public setHomeConfig(pagConfig: PaginationConfig, criteria: string) {
    SessionService.session.homePaginationConfig.autoHide = pagConfig.autoHide;
    SessionService.session.homePaginationConfig.currentPage = pagConfig.currentPage;
    SessionService.session.homePaginationConfig.itemsPerPage = pagConfig.itemsPerPage;
    SessionService.session.homePaginationConfig.numberOfPages = pagConfig.numberOfPages;
    SessionService.session.homePaginationConfig.totalItems = pagConfig.totalItems;
    SessionService.session.homeCriteria = criteria;
  }

  public getCompanyConfig(pagConfig: PaginationConfig, criteria: any, companyId: any) {
    pagConfig.autoHide = SessionService.session.companyPaginationConfig.autoHide;
    pagConfig.currentPage = SessionService.session.companyPaginationConfig.currentPage;
    pagConfig.itemsPerPage = SessionService.session.companyPaginationConfig.itemsPerPage;
    pagConfig.numberOfPages = SessionService.session.companyPaginationConfig.numberOfPages;
    pagConfig.totalItems = SessionService.session.companyPaginationConfig.totalItems;
    criteria.str = SessionService.session.companyCriteria;
    companyId.str = SessionService.session.companyId;
  }

  public setCompanyConfig(pagConfig: PaginationConfig, criteria: string, companyId: string) {
    SessionService.session.companyPaginationConfig.autoHide = pagConfig.autoHide;
    SessionService.session.companyPaginationConfig.currentPage = pagConfig.currentPage;
    SessionService.session.companyPaginationConfig.itemsPerPage = pagConfig.itemsPerPage;
    SessionService.session.companyPaginationConfig.numberOfPages = pagConfig.numberOfPages;
    SessionService.session.companyPaginationConfig.totalItems = pagConfig.totalItems;
    SessionService.session.companyCriteria = criteria;
    SessionService.session.companyId = companyId;
  }

  public getProjectConfig(pagConfig: PaginationConfig, criteria: any, companyId: any, projectId: any) {
    pagConfig.autoHide = SessionService.session.projectPaginationConfig.autoHide;
    pagConfig.currentPage = SessionService.session.projectPaginationConfig.currentPage;
    pagConfig.itemsPerPage = SessionService.session.projectPaginationConfig.itemsPerPage;
    pagConfig.numberOfPages = SessionService.session.projectPaginationConfig.numberOfPages;
    pagConfig.totalItems = SessionService.session.projectPaginationConfig.totalItems;
    criteria.str = SessionService.session.projectCriteria;
    companyId.str = SessionService.session.companyId;
    projectId.str = SessionService.session.projectId;
  }

  public setProjectConfig(pagConfig: PaginationConfig, criteria: string, companyId: string, projectId: string) {
    SessionService.session.projectPaginationConfig.autoHide = pagConfig.autoHide;
    SessionService.session.projectPaginationConfig.currentPage = pagConfig.currentPage;
    SessionService.session.projectPaginationConfig.itemsPerPage = pagConfig.itemsPerPage;
    SessionService.session.projectPaginationConfig.numberOfPages = pagConfig.numberOfPages;
    SessionService.session.projectPaginationConfig.totalItems = pagConfig.totalItems;
    SessionService.session.projectCriteria = criteria;
    SessionService.session.companyId = companyId;
    SessionService.session.projectId = projectId;
  }

  public getFindingConfig(companyId: any, projectId: any, findingId: any) {
    companyId.str = SessionService.session.companyId;
    projectId.str = SessionService.session.projectId;
    findingId.str = SessionService.session.projectId;
  }

  public setFindingConfig(companyId: string, projectId: string, findingId: string) {
    SessionService.session.companyId = companyId;
    SessionService.session.projectId = projectId;
    SessionService.session.findingId = findingId;
  }
}
