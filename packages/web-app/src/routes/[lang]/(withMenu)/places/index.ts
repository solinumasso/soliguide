import { getSearchResultPageController } from './pageController';
import { searchService } from '$lib/services';

// expose controller instance with default services
const pageController = getSearchResultPageController(searchService);
export default pageController;
