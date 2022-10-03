
//// function App2() {
//// 	const [, setValue1] = createParamSignal(get => get("value1"), "foo")
//// 	const [, setValue2] = createParamSignal(get => {
//// 		const v = get("value2")
//// 		if (!v || Number.isNaN(+v)) { return }
//// 		return +v
//// 	}, 5)
////
//// 	return <>
//// 		{css`
//// 			.component-button {
//// 				padding: 0 20px;
//// 				height: 40px;
//// 				border-radius: var(--full);
//// 				background-color: var(--card-color);
//// 				box-shadow: 0 0 0 1px var(--hairline-color);
//// 				// Behavior
//// 				cursor: pointer;
//// 			}
//// 		`}
//// 		<div class="flex-col flex-center gap-10px min-h-$screen">
//// 			<button class="component-button" onClick={e => {
//// 				setValue1("foo")
//// 				setValue2(5)
//// 			}}>
//// 				Clear <code>value1</code> and <code>value2</code>
//// 			</button>
//// 			<div></div>
//// 			<div class="flex-row gap-10px">
//// 				<button class="component-button" onClick={e => setValue1("foo")}>Reset <code>value1</code></button>
//// 				<button class="component-button" onClick={e => setValue1("bar")}>Set <code>value1</code> to bar</button>
//// 				<button class="component-button" onClick={e => setValue1("baz")}>Set <code>value1</code> to baz</button>
//// 				<button class="component-button" onClick={e => setValue1("qux")}>Set <code>value1</code> to qux</button>
//// 			</div>
//// 			<div class="flex-row gap-10px">
//// 				<button class="component-button" onClick={e => setValue2(5)}>Reset <code>value2</code></button>
//// 				<button class="component-button" onClick={e => setValue2(6)}>Set <code>value2</code> to bar</button>
//// 				<button class="component-button" onClick={e => setValue2(7)}>Set <code>value2</code> to baz</button>
//// 				<button class="component-button" onClick={e => setValue2(8)}>Set <code>value2</code> to qux</button>
//// 			</div>
//// 		</div>
//// 	</>
//// }
