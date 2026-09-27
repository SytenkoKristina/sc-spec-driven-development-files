type ConfirmationBannerProps = {
  message: string;
};

export default function ConfirmationBanner({
  message,
}: ConfirmationBannerProps) {
  return (
    <p role="status">
      <mark>{message}</mark>
    </p>
  );
}
