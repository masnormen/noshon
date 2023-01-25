import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'experimental-edge',
};

const MarkupButton = ({ children }: any) => (
  <button tw="rounded-md bg-white px-4 py-1 font-bold text-blue-600 hover:bg-gray-100 disabled:pointer-events-none disabled:text-gray-300">
    {children}
  </button>
);

const ElementButton = ({ children }: any) => (
  <button tw="rounded-md bg-white px-4 py-1 hover:bg-gray-100 disabled:pointer-events-none disabled:text-gray-300">
    {children}
  </button>
);

export default async function handler() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
        }}
      >
        <div
          style={{
            backgroundImage:
              'linear-gradient(to left bottom, rgb(199, 210, 254), rgb(254, 202, 202), rgb(254, 249, 195))',
          }}
          tw="flex flex-col md:flex-row w-full h-full md:items-center justify-between p-28"
        >
          <h2 tw="flex flex-col text-7xl font-bold tracking-tight text-gray-900 text-left">Noshon</h2>
          <div tw="flex mt-2 text-lg">
            <aside tw="flex items-center rounded-lg border border-gray-300 bg-white px-3 py-1 opacity-100">
              <MarkupButton>B</MarkupButton>
              <MarkupButton>
                <span tw="italic">i</span>
              </MarkupButton>
              <MarkupButton>
                <span tw="underline">U</span>
              </MarkupButton>
              <ElementButton>
                <span tw="line-through">S</span>
              </ElementButton>
              <ElementButton>
                <span tw="font-mono text-sm">&lt;&gt;</span>
              </ElementButton>
              <ElementButton>H1</ElementButton>
              <ElementButton>H2</ElementButton>
              <ElementButton>H3</ElementButton>
              <ElementButton>
                <span tw="font-mono text-sm">&lt;/&gt;</span>
              </ElementButton>
              <ElementButton>‟</ElementButton>
              <ElementButton>–</ElementButton>
              <ElementButton>☑</ElementButton>
              <ElementButton>🖼️</ElementButton>
            </aside>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 600,
    }
  );
}
