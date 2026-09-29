/*
 * Copyright (c) 2026.
 * @702361946
 * 702361946@qq.com
 * https://github.com/702361946
 */

import "./LToolUICH.css";

export function createDropdownButton(callbackFunction: (() => void) | null = null): HTMLButtonElement {
    const dropdownBtn = document.createElement("button");
    dropdownBtn.classList.add("player_config_dropdown_button");
    dropdownBtn.innerHTML =
        `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
        </svg>`;

    if (typeof callbackFunction === "function") {
        dropdownBtn.onclick = (e) => {
            e.stopPropagation();
            callbackFunction();
        };
    }

    return dropdownBtn;
}

let _currentDropdownTrigger: HTMLElement | null = null;

export function showDropdownList(
    targetElement: HTMLElement,
    itemElements: Element[],
    onSelect: ((target: HTMLElement, item: Element) => void) | null = null,
    referenceElement: HTMLElement | null = null
): void {
    let d = document.getElementById("player_config_dropdown_panel");
    if (!d) {
        d = document.createElement("div");
        d.id = "player_config_dropdown_panel";
        (d as any).popover = "manual";
        d.classList.add("player_config_dropdown_list_panel");
        document.body.append(d);
    } else {
        (d as any).hidePopover();
        d.classList.remove("flipped");
    }

    d.innerHTML = "";
    for (const item of itemElements) {
        const itemBtn = document.createElement("button");
        itemBtn.type = "button";
        itemBtn.classList.add("player_config_dropdown_list_item");
        itemBtn.append(item);
        if (onSelect != null) {
            itemBtn.onclick = () => {
                onSelect(targetElement, item);
                closeDropdown();
            };
        }
        d.append(itemBtn);
    }

    const reference = referenceElement || targetElement.closest(".player_config") as HTMLElement;
    const rect = reference.getBoundingClientRect();

    const gap = 4;
    const top = rect.bottom + gap;
    const left = rect.left;
    const minWidth = rect.width;

    d.style.top = top + "px";
    d.style.left = left + "px";
    d.style.minWidth = minWidth + "px";

    (d as any).showPopover();
    const panelRect = d.getBoundingClientRect();
    const winW = window.innerWidth;
    const winH = window.innerHeight;
    const padding = 8;

    if (left + panelRect.width > winW - padding) {
        const newLeft = winW - panelRect.width - padding;
        d.style.left = Math.max(padding, newLeft) + "px";
    }

    if (top + panelRect.height > winH - padding) {
        const newTop = rect.top - panelRect.height - gap;
        d.style.top = Math.max(padding, newTop) + "px";
        d.classList.add("flipped");
    }

    const closeOnClickOutside = (e: MouseEvent) => {
        if (!d!.contains(e.target as Node) && e.target !== targetElement && e.target !== referenceElement) {
            closeDropdown();
            document.removeEventListener("click", closeOnClickOutside);
        }
    };
    requestAnimationFrame(() => {
        document.addEventListener("click", closeOnClickOutside);
    });

    _currentDropdownTrigger = targetElement;
    targetElement.classList.add("dropdown_active");
}

export function closeDropdown(): void {
    const d = document.getElementById("player_config_dropdown_panel");
    const trigger = _currentDropdownTrigger;

    if (d) {
        (d as any).hidePopover();
        d.classList.remove("flipped");
    }
    if (trigger) {
        trigger.classList.remove("dropdown_active");
        _currentDropdownTrigger = null;
    }
}
