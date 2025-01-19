import { ComponentProps } from "react";

const IconStarGradient = (props: ComponentProps<"svg">) => {
  return (
    <svg
      width={15}
      height={15}
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M8.59024 0.644475L9.97913 3.45026C10.1439 3.78929 10.4735 4.03479 10.8619 4.08156L13.981 4.52581C14.9462 4.66609 15.3228 5.83517 14.6284 6.51323L12.3803 8.69941C12.1096 8.96829 11.9801 9.35409 12.0389 9.72819L12.5686 12.8146C12.7334 13.7615 11.7329 14.4863 10.8737 14.0421L8.08412 12.5924C7.74278 12.4171 7.33082 12.4171 6.98948 12.5924L4.21169 14.0304C3.35246 14.4746 2.35198 13.7498 2.51677 12.8029L3.04643 9.72819C3.11705 9.35409 2.98758 8.96829 2.70509 8.69941L0.456967 6.52493C-0.23748 5.84686 0.150939 4.67779 1.10433 4.5375L4.22346 4.09325C4.60011 4.03479 4.92968 3.80098 5.10623 3.46195L6.49513 0.656165C6.91886 -0.208951 8.16651 -0.208951 8.59024 0.644475Z"
        fill="url(#paint0_linear_693_4755)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_693_4755"
          x1="0.103858"
          y1="7.08658"
          x2="14.9841"
          y2="7.08658"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFAFA7" />
          <stop offset={1} stopColor="#FCD2CB" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default IconStarGradient;
