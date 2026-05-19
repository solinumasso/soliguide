export type MarkerOptions = {
  lat: number;
  lng: number;
  options: {
    id: number;
    title: string;
    icon: {
      url: string;
      scaledSize: {
        width: number;
        height: number;
      };
    };
  };
};
