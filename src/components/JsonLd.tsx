// Injects a JSON-LD structured-data block. Server component; the payload is
// built server-side and serialized into a <script type="application/ld+json">.
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
