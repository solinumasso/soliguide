import { locationService, searchParamsService } from '$lib/services';
import { getHomePageController } from './pageController';

// expose controller instance with default services
const pageController = getHomePageController(locationService, searchParamsService);
export default pageController;
