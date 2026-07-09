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
  viewBox="0 0 16 16"
>
  <g id="menu-burger">
    <path
      id="Rectangle 3"
      d="M1 8C1 7.44772 1.33579 7 1.75 7H14.25C14.6642 7 15 7.44772 15 8C15 8.55228 14.6642 9 14.25 9H1.75C1.33579 9 1 8.55228 1 8Z"
      fill={color}
    />
    <path
      id="Rectangle 2"
      d="M1 13.5C1 12.9477 1.33579 12.5 1.75 12.5H14.25C14.6642 12.5 15 12.9477 15 13.5C15 14.0523 14.6642 14.5 14.25 14.5H1.75C1.33579 14.5 1 14.0523 1 13.5Z"
      fill={color}
    />
    <path
      id="Rectangle 1"
      d="M1 2.5C1 1.94772 1.33579 1.5 1.75 1.5H14.25C14.6642 1.5 15 1.94772 15 2.5C15 3.05228 14.6642 3.5 14.25 3.5H1.75C1.33579 3.5 1 3.05228 1 2.5Z"
      fill={color}
    />
  </g>
</svg>
