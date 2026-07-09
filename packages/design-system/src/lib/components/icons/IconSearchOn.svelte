<script lang="ts">
  export let size = 16;
  export let role = 'img';
  export let color = '#FF4124';
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  {...$$restProps}
  {role}
  width={size}
  height={size}
  fill="none"
  viewBox="0 0 18 16"
>
  <g id="search">
    <g id="Vector">
      <path
        d="M12.1346 12.1685C11.8416 11.8758 11.878 11.4442 12.2159 11.2047C12.5538 10.9651 13.0653 11.0082 13.3583 11.301L16.933 14.8726C17.226 15.1653 17.1896 15.5969 16.8517 15.8364C16.5138 16.076 16.0023 16.0329 15.7093 15.7401L12.1346 12.1685Z"
        fill={color}
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M7.83337 14C11.6994 14 14.8334 10.866 14.8334 7C14.8334 3.13401 11.6994 0 7.83337 0C3.96738 0 0.833374 3.13401 0.833374 7C0.833374 10.866 3.96738 14 7.83337 14Z"
        fill={color}
      />
    </g>
  </g>
</svg>
