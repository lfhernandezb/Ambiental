export class PaginationConfig {
  currentPage: number;
  itemsPerPage: number;
  numberOfPages: number;
  totalItems: number;
  autoHide: boolean;

  // eliminar
  criteria: string;

  constructor() {
    this.currentPage = 0;
    this.itemsPerPage = 0;
    this.numberOfPages = 0;
    this.totalItems = 0;
    this.autoHide = false;
    // eliminar
    this.criteria = '';
  }
}
