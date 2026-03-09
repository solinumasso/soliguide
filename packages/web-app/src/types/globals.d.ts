interface Window {
  TallyConfig?: {
    formId: string;
    popup: {
      width: number;
      emoji: {
        text: string;
        animation: string;
      };
      open: {
        trigger: string;
        scrollPercent: number;
      };
      layout: string;
      hideTitle: boolean;
      autoClose: number;
      showOnce: boolean;
      doNotShowAfterSubmit: boolean;
    };
  };
}
