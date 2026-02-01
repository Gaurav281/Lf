export default function BannerAd() {
  const key = import.meta.env.VITE_ADSTERRA_HOME_BANNER_KEY;
  const src = import.meta.env.VITE_ADSTERRA_HOME_BANNER_SRC;

  if (!key || !src) return null;

  return (
    <div
      className="w-full flex justify-center my-8"
      dangerouslySetInnerHTML={{
        __html: `
          <script>
            atOptions = {
              'key': '${key}',
              'format': 'iframe',
              'height': 250,
              'width': 300,
              'params': {}
            };
          </script>
          <script src="${src}"></script>
        `
      }}
    />
  );
}
