type LoadingSize = "sm" | "md" | "lg";

const SIZE_CLASSES: Record<LoadingSize, string> = {
  sm: "w-8",
  md: "w-14",
  lg: "w-16",
};

function ShapeOne() {
  return (
    <svg
      width="full"
      viewBox="0 0 11830 11380"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <path
          d="M11830 2288.99L9450.49 0C7498.09 1878.43 4332.21 1878.43 2379.51 0L0 2288.99C1952.71 4167.42 1952.71 7212.58 0 9091.01L2379.51 11380C4332.21 9501.57 7497.79 9501.57 9450.49 11380L11830 9091.01C9877.29 7212.58 9877.29 4167.42 11830 2288.99Z"
          fill="#CA2B18"
        />
      </g>
    </svg>
  );
}

function ShapeTwo() {
  return (
    <svg
      width="full"
      viewBox="0 0 12727 12727"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <path
          d="M12454.1 8049.8L10586.4 6363.35L12454.1 4676.9C13027.2 4159.68 12633.6 3209.29 11862.5 3248.62L9349.3 3377.1L9477.78 863.938C9517.11 93.0592 8567.02 -300.485 8049.5 272.27L6363.05 2140.03L4676.6 272.27C4159.38 -300.785 3208.99 93.0592 3248.32 863.938L3376.8 3377.1L863.636 3248.62C92.7575 3209.29 -300.787 4159.38 271.969 4676.9L2139.73 6363.35L271.969 8049.8C-301.087 8567.02 92.4573 9517.41 863.636 9478.08L3376.8 9349.6L3248.32 11862.8C3208.99 12633.6 4159.08 13027.2 4676.6 12454.4L6363.05 10586.7L8049.5 12454.4C8566.72 13027.5 9517.11 12633.6 9477.78 11862.8L9349.3 9349.6L11862.5 9478.08C12633.3 9517.41 13026.9 8567.32 12454.1 8049.8Z"
          fill="#00717A"
        />
      </g>
    </svg>
  );
}

function ShapeThree() {
  return (
    <svg
      width="full"
      viewBox="0 0 4711 4711"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <path
          d="M4711 1720.45H3888.46L4470.05 1138.86L3572.14 240.952L2990.37 822.541V0H1720.45V822.541L1138.86 240.952L240.952 1138.86L822.541 1720.45H0V2990.37H822.541L240.952 3572.14L1138.86 4470.05L1720.45 3888.46V4711H2990.37V3888.46L3572.14 4470.05L4470.05 3572.14L3888.46 2990.37H4711V1720.45Z"
          fill="#B9A657"
        />
      </g>
    </svg>
  );
}

function ShapeFour() {
  return (
    <svg
      width="full"
      viewBox="0 0 194 194"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <path
          d="M96.77 0C111.04 46.27 147.26 82.5 193.54 96.77C147.27 111.04 111.04 147.26 96.77 193.54C82.5 147.26 46.27 111.04 0 96.77C46.27 82.5 82.5 46.27 96.77 0Z"
          fill="#72BC71"
        />
      </g>
    </svg>
  );
}

export function Loading({
  size = "lg",
  overlay = false,
  className = "",
}: {
  size?: LoadingSize;
  overlay?: boolean;
  className?: string;
}) {
  const sizeClass = SIZE_CLASSES[size];

  const content = (
    <div className="grid gap-4 grid-cols-2">
      <div className={`${sizeClass} animate-bounce`}>
        <ShapeOne />
      </div>
      <div className={`${sizeClass} animate-spin`}>
        <ShapeTwo />
      </div>
      <div className={`${sizeClass} animate-fifth`}>
        <ShapeThree />
      </div>
      <div className={`${sizeClass} animate-pulse`}>
        <ShapeFour />
      </div>
    </div>
  );

  if (overlay) {
    return (
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-neutral-100 ${className}`}
      >
        {content}
      </div>
    );
  }

  return <div className={className}>{content}</div>;
}
