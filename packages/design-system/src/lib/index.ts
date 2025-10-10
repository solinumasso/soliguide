/*
 * Soliguide: Useful information for those who need it
 *
 * SPDX-FileCopyrightText: © 2024 Solinum
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
// Reexport your entry components here
import { Button, ButtonLink } from './components/buttons/index';
import Text from './components/Text.svelte';
import Spinner from './components/Spinner.svelte';
import PageLoader from './components/PageLoader.svelte';
import ComponentUsingTranslation from './components/ComponentUsingTranslation.svelte';
import ThemeContext from './theme/ThemeContext.svelte';
import ToggleButton from './components/ToggleButton.svelte';
import ActionButton from './components/ActionButton.svelte';
import AppIcon from './components/AppIcon.svelte';
import InfoIcon from './components/InfoIcon.svelte';
import Link from './components/Link.svelte';

import InputText from './components/forms/InputText.svelte';
import FormControl from './components/forms/FormControl.svelte';
import ToggleSwitch from './components/forms/ToggleSwitch.svelte';

import {
  Blind,
  BusinessCenter,
  Cake,
  CheckMark,
  CleanHands,
  ConfirmationNumber,
  Countertops,
  DinnerDining,
  EmojiNature,
  FaceRetouchingNatural,
  Flag,
  Forum,
  Gavel,
  Hail,
  Healing,
  Home,
  HomeWork,
  IconBurgerOff,
  IconBurgerOn,
  IconFavoriteOff,
  IconFavoriteOn,
  IconHomeOff,
  IconHomeOn,
  IconSearchOff,
  IconSearchOn,
  IconTalkOff,
  IconTalkOn,
  RecordVoiceOver,
  RestaurantMenu,
  SetMeal,
  ShoppingCart,
  SportsFootball,
  Straighten,
  ThermostatAuto
} from './components/icons';

import Divider from './components/layout/Divider.svelte';
import Topbar from './components/navigation/Topbar.svelte';
import Menu from './components/navigation/Menu.svelte';
import Badge from './components/dataDisplay/Badge.svelte';
import Tag from './components/dataDisplay/Tag.svelte';
import { ListItem } from './components/dataDisplay/ListItem';
import { CardBody, CardHeader, Card, CardFooter } from './components/dataDisplay/Card';
import { Accordion, AccordionGroup } from './components/dataDisplay/Accordion/index';
import BasicCard from './components/dataDisplay/BasicCard.svelte';
import TextClamper from './components/dataDisplay/TextClamper.svelte';
import InfoBlock from './components/dataDisplay/InfoBlock.svelte';
import Toast from './components/dataDisplay/Toast.svelte';
import Tile from './components/Tile.svelte';

import Modal from './components/feedback/Modal.svelte';

// Utilities
import { changeDesignSystemLocale, getDesignSystemLocale } from './i18n';
import { debounce, DEFAULT_DEBOUNCE_DELAY } from './time';
import { generateId } from './id';

// Get types from root d.ts file
// skipcq: JS-C1003
import type * as types from './types/index.d.ts';

export type { types };

export {
  AccessibleForward,
  Accordion,
  AccordionGroup,
  ActionButton,
  AppIcon,
  Article,
  AutoStories,
  BabyChangingStation,
  BabyParcel,
  Badge,
  Balance,
  BasicCard,
  Bathtub,
  Bedtime,
  Blind,
  BusinessCenter,
  Button,
  ButtonLink,
  Cake,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  changeDesignSystemLocale,
  CheckMark,
  CleanHands,
  ComponentUsingTranslation,
  ConfirmationNumber,
  Countertops,
  debounce,
  DEFAULT_DEBOUNCE_DELAY,
  DinnerDining,
  Divider,
  EmojiNature,
  FaceRetouchingNatural,
  Flag,
  FormControl,
  Forum,
  Gavel,
  generateId,
  getDesignSystemLocale,
  Hail,
  Healing,
  Home,
  HomeWork,
  IconBurgerOff,
  IconBurgerOn,
  IconFavoriteOff,
  IconFavoriteOn,
  IconHomeOff,
  IconHomeOn,
  IconSearchOff,
  IconSearchOn,
  IconTalkOff,
  IconTalkOn,
  InfoBlock,
  InfoIcon,
  InputText,
  Link,
  ListItem,
  Menu,
  Modal,
  PageLoader,
  RecordVoiceOver,
  RestaurantMenu,
  SetMeal,
  ShoppingCart,
  Spinner,
  SportsFootball,
  Straighten,
  Tag,
  Text,
  TextClamper,
  ThemeContext,
  ThermostatAuto,
  Tile,
  Toast,
  ToggleButton,
  ToggleSwitch,
  Topbar
};
