export function Globals() {
	return <>
		<style jsx global>{`
			:root {
				--full: 1000px;
			}

			/* Position */
			.fixed    { position: fixed;    z-index: 10; }
			.relative { position: relative; z-index: 10; }
			.absolute { position: absolute; z-index: 10; }

			.inset   { inset: 0; }
			.inset-t { inset: 0 0 auto 0; }
			.inset-r { inset: 0 0 0 auto; }
			.inset-b { inset: auto 0 0 0; }
			.inset-l { inset: 0 auto 0 0; }

			/* Pointer events */
			.auto-pointer-events     { pointer-events: none; }
			.auto-pointer-events > * { pointer-events: auto; }

			/* CSS Grid */
			.grid                   { display: grid; }
			.grid.grid-center       { place-items: center; }

			/* Flexbox */
			.flex-row               { display: flex; flex-direction: row; }
			.flex-row.flex-center   { justify-content: center; align-items: center; }
			.flex-row.flex-center-x { justify-content: center; }
			.flex-row.flex-center-y { align-items: center; }

			.flex-col               { display: flex; flex-direction: column; }
			.flex-col.flex-center   { justify-content: center; align-items: center; }
			.flex-col.flex-center-x { align-items: center; }
			.flex-col.flex-center-y { justify-content: center; }

			.flex-wrap-nowrap { flex-wrap: nowrap; }
			.flex-wrap        { flex-grow: 1; }

			.flex-shrink-0 { flex-shrink: 0; }
			.flex-shrink   { flex-shrink: 1; }

			.flex-grow-0 { flex-grow: 0; }
			.flex-grow   { flex-grow: 1; }

			/* Gap */
			.gap-6  { gap:  6px; } /* 6x */
			.gap-8  { gap:  8px; }
			.gap-12 { gap: 12px; } /* 6x */
			.gap-16 { gap: 16px; }
			.gap-24 { gap: 24px; }
			.gap-32 { gap: 32px; }
			.gap-40 { gap: 40px; }
			.gap-48 { gap: 48px; }
			.gap-56 { gap: 56px; }
			.gap-64 { gap: 64px; }
		`}</style>
	</>
}
