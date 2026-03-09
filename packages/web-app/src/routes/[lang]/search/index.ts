import { locationService } from '$lib/services';
import { categoryService } from '$lib/services/categoryService';
import { getSearchPageController } from './pageController';

// expose controller instance with default services
const pageController = getSearchPageController(locationService, categoryService);
export default pageController;
