/**
 * v0 by Vercel.
 * @see https://v0.dev/t/NPdGwIQfRpv
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
export default function Test() {
  return (
    <div className="flex h-screen w-full" >
      <div>test</div>
      <div className="flex h-screen w-full">
        <div className="flex flex-col flex-1 space-y-4 p-6">
          <div className="flex-1 overflow-auto rounded-lg border bg-background p-4 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Scrollable Content</h2>
            <div className="space-y-4 text-sm leading-relaxed">
              <p>
                This is the top box in the left column. It has scrollable content that will be contained within the box if
                it exceeds the available space.
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl nec ultricies lacinia, nisl
                nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Donec vitae nisl nec nisl aliquam nisl. Sed
                euismod, nisl nec ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Donec
                vitae nisl nec nisl aliquam nisl.
              </p>


            </div>
          </div>
          <div className="sticky bottom-0 rounded-lg border bg-background p-4 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Sticky Content</h2>
            <p className="text-sm leading-relaxed">
              This is the bottom box in the left column. It is sticky and will stay at the bottom of the column at all
              times.
            </p>
          </div>
        </div>
        <div className="flex-1 p-6">
          <h2 className="mb-4 text-xl font-semibold">Right Column</h2>
          <p className="text-sm leading-relaxed">This is the right column. You can add any additional content here.</p>
        </div>
      </div>

    </div>

  )
}