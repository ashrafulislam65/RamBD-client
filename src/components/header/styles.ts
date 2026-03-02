import styled from "styled-components";
import { layoutConstant } from "utils/constants";
import { getTheme } from "@utils/utils";

const StyledHeader = styled.header`
  z-index: 999;
  position: sticky;
  top: 0;
  height: ${layoutConstant.headerHeight};
  background: ${getTheme("colors.body.paper")};

  .rb-nav-row {
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0 16px;
    gap: 12px;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
  }

  .rb-logo-wrap {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    text-decoration: none;
    gap: 8px;
  }

  .rb-logo-img {
    width: 60px;
    height: 60px;
    object-fit: contain;
    display: block;
  }

  .rb-logo-text {
    font-family: "Arial Black", Gadget, sans-serif;
    font-size: 28px;
    font-weight: 900;
    white-space: nowrap;
    margin: 0;
  }

  .rb-search {
    flex: 1 1 auto;
    min-width: 0;
    padding: 0 10px;
  }

  .rb-desktop {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  .rb-hamburger {
    display: none;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    border: 1px solid #D23F57;
    background: #fef6f7;
    cursor: pointer;
    padding: 6px;
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    border-radius: 4px;
    margin-left: 4px;

    span {
      display: block;
      width: 20px;
      height: 2px;
      background: #D23F57;
      border-radius: 2px;
    }
  }

  /* Tablet and Mobile adjustments */
  @media only screen and (max-width: 1023px) {
    .rb-desktop, 
    .header-right,
    .category-holder,
    .icon-holder {
      display: none !important;
    }

    .rb-hamburger {
      display: flex !important;
    }

    .rb-logo-img {
      width: 34px;
      height: 34px;
    }

    .rb-logo-text {
      font-size: 16px;
    }
  }

  /* Specific Mobile adjustments */
  @media only screen and (max-width: 768px) {
    height: ${layoutConstant.mobileHeaderHeight};

    .rb-nav-row {
      padding: 0 8px;
      gap: 8px;
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-content: center;
    }

    .rb-logo-img {
      width: 28px !important;
      height: 28px !important;
    }

    .rb-logo-text {
      font-size: 14px !important;
      margin-left: 4px !important;
    }

    .rb-hamburger {
      grid-column: 3;
    }


    .rb-search {
      grid-column: 2;
      padding: 0;
    }
  }

`;

export default StyledHeader;
