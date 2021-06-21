import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import MetisMenu from 'metismenujs/dist/metismenujs';

import { MenuItem } from './menu.model';
import { Router, NavigationEnd } from '@angular/router';
import { PermissionManagementService } from '../../services/PermissionManagementService/permissionManagement.service';
import { TenantMasterService } from '../../services/TenantMasterService/tenantMaster.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, AfterViewInit {
  isLoading: boolean = true
  @ViewChild('sidebarToggler') sidebarToggler: ElementRef;

  menuItems = [];
  @ViewChild('sidebarMenu') sidebarMenu: ElementRef;

  constructor(@Inject(DOCUMENT) private document: Document, private renderer: Renderer2, router: Router,
    private permissionManagement: PermissionManagementService, private tenantMasterService: TenantMasterService) {

    router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {

        /**
         * Activating the current active item dropdown
         */
        this._activateMenuDropdown();

        /**
         * closing the sidebar
         */
        if (window.matchMedia('(max-width: 991px)').matches) {
          this.document.body.classList.remove('sidebar-open');
        }
      }
    });
  }

  ngOnInit(): void {
  
    this.permissionManagement.accessList().subscribe(accessList => {
      for (var i = 0; i < accessList.length; i++) {
        //let selected = data.filter(x => x.module_id == filtered[i].module_id + "")[0]
        if (accessList[i].module_type === "Parent") {
          this.menuItems.push({
            moduleId: accessList[i].module_id,
            label: accessList[i].module_name,
            isTitle: true,
            count: accessList[i].count,
            isCount: accessList[i].module_id === 39 ? true : false,
          })
        }
        if (accessList[i].module_type === "Sub-Parent") {
          let subList = [];
          let subSelected = accessList.filter(x => x.parent_module_id == accessList[i].module_id)
          for (var y = 0; y < subSelected.length; y++) {
            let child = accessList.filter(x => x.module_id == subSelected[y].module_id + "")[0]
            subList.push({
              moduleId: accessList[i].module_id,
              label: child.module_name,
              link: child.link,
              count: accessList[i].count,
              isCount: accessList[i].module_id === 39 ? true : false,
            })
          }
          if (subSelected.length > 0) {
            this.menuItems.push({
              moduleId: accessList[i].module_id,
              label: accessList[i].module_name,
              icon: accessList[i].classes,
              subItems: subList,
              count: accessList[i].count,
              isCount: accessList[i].module_id === 39 ? true : false,
            })
          }
          else {
            this.menuItems.push({
              moduleId: accessList[i].module_id,
              icon: accessList[i].classes,
              label: accessList[i].module_name,
              link: accessList[i].link,
              count: accessList[i].count,
              isCount: accessList[i].module_id === 39 ? true : false,
            })
          }

        }
      };

      this.isLoading = false
       
      setTimeout(() => {
        const desktopMedium = window.matchMedia('(min-width:992px) and (max-width: 1199px)');
        desktopMedium.addListener(this.iconSidebar);
        this.iconSidebar(desktopMedium);
        
        new MetisMenu(this.sidebarMenu.nativeElement);

        this._activateMenuDropdown();
      }, 100);
    });

  }

  ngAfterViewInit() {
    // activate menu item
    // new MetisMenu(this.sidebarMenu.nativeElement);

    // this._activateMenuDropdown();
  }

  /**
   * Toggle sidebar on hamburger button click
   */
  toggleSidebar(e) {
    
    this.sidebarToggler.nativeElement.classList.toggle('not-active');
    this.sidebarToggler.nativeElement.classList.toggle('active');
    if (window.matchMedia('(min-width: 992px)').matches) {
      e.preventDefault();
      this.document.body.classList.toggle('sidebar-folded');
    } else if (window.matchMedia('(max-width: 991px)').matches) {
      e.preventDefault();
      this.document.body.classList.toggle('sidebar-open');
    }
  }


  /**
   * Toggle settings-sidebar 
   */
  toggleSettingsSidebar(e) {
    e.preventDefault();
    this.document.body.classList.toggle('settings-open');
  }


  /**
   * Open sidebar when hover (in folded folded state)
   */
  operSidebarFolded() {
    if (this.document.body.classList.contains('sidebar-folded')) {
      this.document.body.classList.add("open-sidebar-folded");
    }
  }


  /**
   * Fold sidebar after mouse leave (in folded state)
   */
  closeSidebarFolded() {
    if (this.document.body.classList.contains('sidebar-folded')) {
      this.document.body.classList.remove("open-sidebar-folded");
    }
  }

  /**
   * Sidebar-folded on desktop (min-width:992px and max-width: 1199px)
   */
  iconSidebar(e) {
    if (e.matches) {
      this.document.body.classList.add('sidebar-folded');
    } else {
      this.document.body.classList.remove('sidebar-folded');
    }
  }


  /**
   * Returns true or false if given menu item has child or not
   * @param item menuItem
   */
  hasItems(item: MenuItem) {
    return item.subItems !== undefined ? item.subItems.length > 0 : false;
  }


  /**
   * Reset the menus then hilight current active menu item
   */
  _activateMenuDropdown() {
    this.resetMenuItems();
    this.activateMenuItems();
  }


  /**
   * Resets the menus
   */
  resetMenuItems() {

    const links = document.getElementsByClassName('nav-link-ref');

    for (let i = 0; i < links.length; i++) {
      const menuItemEl = links[i];
      menuItemEl.classList.remove('mm-active');
      const parentEl = menuItemEl.parentElement;

      if (parentEl) {
        parentEl.classList.remove('mm-active');
        const parent2El = parentEl.parentElement;

        if (parent2El) {
          parent2El.classList.remove('mm-show');
        }

        const parent3El = parent2El.parentElement;
        if (parent3El) {
          parent3El.classList.remove('mm-active');

          if (parent3El.classList.contains('side-nav-item')) {
            const firstAnchor = parent3El.querySelector('.side-nav-link-a-ref');

            if (firstAnchor) {
              firstAnchor.classList.remove('mm-active');
            }
          }

          const parent4El = parent3El.parentElement;
          if (parent4El) {
            parent4El.classList.remove('mm-show');

            const parent5El = parent4El.parentElement;
            if (parent5El) {
              parent5El.classList.remove('mm-active');
            }
          }
        }
      }
    }
  };


  /**
   * Toggles the menu items
   */
  activateMenuItems() {

    const links = document.getElementsByClassName('nav-link-ref');

    let menuItemEl = null;

    for (let i = 0; i < links.length; i++) {
      // tslint:disable-next-line: no-string-literal
      if (window.location.pathname === links[i]['pathname']) {

        menuItemEl = links[i];

        break;
      }
    }

    if (menuItemEl) {
      menuItemEl.classList.add('mm-active');
      const parentEl = menuItemEl.parentElement;

      if (parentEl) {
        parentEl.classList.add('mm-active');

        const parent2El = parentEl.parentElement;
        if (parent2El) {
          parent2El.classList.add('mm-show');
        }

        const parent3El = parent2El.parentElement;
        if (parent3El) {
          parent3El.classList.add('mm-active');

          if (parent3El.classList.contains('side-nav-item')) {
            const firstAnchor = parent3El.querySelector('.side-nav-link-a-ref');

            if (firstAnchor) {
              firstAnchor.classList.add('mm-active');
            }
          }

          const parent4El = parent3El.parentElement;
          if (parent4El) {
            parent4El.classList.add('mm-show');

            const parent5El = parent4El.parentElement;
            if (parent5El) {
              parent5El.classList.add('mm-active');
            }
          }
        }
      }
    }
  };


}