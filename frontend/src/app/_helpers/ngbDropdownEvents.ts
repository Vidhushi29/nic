import { Component, ElementRef, QueryList, ViewChildren } from "@angular/core";

@Component({
    selector: 'ngb-dropdown-events',
    template: '',
    styleUrls: []
})
export class ngbDropdownEvents {
    @ViewChildren("dropdownItem") dropdownItem: QueryList<ElementRef>;
    openedDropdownId: any;

    dropdownToggled($event, jumpItemForParent) {
        if ($event == true) {
            this.openedDropdownId = jumpItemForParent;
        }
        else {
            if (this.openedDropdownId == jumpItemForParent) {
                // if previosly opened dropdown was closed
                this.openedDropdownId = undefined;
            }
        }
    }

    keyPressesonDropdown($event, jumpItemForParent) {
        let pressedKeyText = $event.code.toLowerCase().replace("key", "").replace("digit", "");
        if (this.openedDropdownId == jumpItemForParent && (/[A-Za-z0-9]+/img).test(pressedKeyText)) {
            let jumpToItem = undefined;
            const totalOptions = this.dropdownItem.filter(eachfoundItem => eachfoundItem.nativeElement.getAttribute("data-parent-name") == jumpItemForParent);
            let foundAtIndex = -1;
            for (let eachfoundItem of totalOptions) {
                foundAtIndex++;
                if (eachfoundItem.nativeElement.innerHTML.trim().toLowerCase().indexOf(pressedKeyText) == 0) {
                    jumpToItem = eachfoundItem.nativeElement;
                    break;
                }
            }

            if (jumpToItem) {
                if (foundAtIndex > 8) {
                    var scrollButton = jumpToItem.offsetTop;
                    jumpToItem.parentElement.scrollTo({ top: scrollButton, behavior: 'smooth'});
                    // jumpToItem.scrollIntoView();
                }
                jumpToItem.focus();
            }
        }
    }

    keyPressedOnMultiDropdown($event) {
        let pressedKeyText = $event.code.toLowerCase().replace("key", "").replace("digit", "");
        const $Key = window['$'];
        let ngMultiSelectDropdown = $Key($event.target);
        if(ngMultiSelectDropdown[0].tagName.toLowerCase() != "ng-multiselect-dropdown"){
            ngMultiSelectDropdown = $Key($event.target).parents("ng-multiselect-dropdown");
        }

        const isDropdownVisible = !ngMultiSelectDropdown.find(".dropdown-list").is(":hidden");
        if (isDropdownVisible && (/[A-Za-z0-9]+/img).test(pressedKeyText)) {
            let jumpToItem = undefined;
            const totalOptions = ngMultiSelectDropdown.find(".dropdown-list").find("li.multiselect-item-checkbox div");
            let foundAtIndex = -1;
            for (let eachfoundItem of totalOptions) {
                foundAtIndex++;
                if (eachfoundItem.innerHTML.trim().toLowerCase().indexOf(pressedKeyText) == 0) {
                    jumpToItem = eachfoundItem;
                    break;
                }
            }

            if (jumpToItem) {
                this.ngClearMultiSelectSelection();
                jumpToItem = $Key(jumpToItem).parents("li.multiselect-item-checkbox")[0];
                if (foundAtIndex > 5) {
                    var scrollButton = jumpToItem.offsetTop;
                    ($Key(jumpToItem).parents("ul")[0]).scrollTo({ top: scrollButton, behavior: 'smooth' });
                    // jumpToItem.scrollIntoView();
                }
                $Key(jumpToItem).find("div").focus();
                jumpToItem.classList.add("ng-multiselect-dropdown-option-selected");
            }
        }
    }

    ngClearMultiSelectSelection(){
        const $Key = window['$'];
        let allSelected = $Key(".ng-multiselect-dropdown-option-selected");
        for (let index = 0; index < allSelected.length; index++) {
            const element = allSelected[index];
            element.classList.remove("ng-multiselect-dropdown-option-selected");
        }
    }
}