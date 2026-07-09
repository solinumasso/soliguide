<script lang="ts">
  export let size = 17;
  export let role = 'img';
  export let color = '#737373';
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  {...$$restProps}
  {role}
  width={size}
  height={size}
  fill="none"
  viewBox="0 0 17 17"
>
  <path
    d="M6.04922 14.8186L16.0483 4.81806L14.0485 2.81824L6.04922 10.8189L2.04816 6.81788L0.0483398 8.81771L6.04922 14.8186Z"
    fill={color}
  />
</svg>
