import React from 'react';
import classes from './Burger.module.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';


	const burger = (props) => {
	let ingredients = Object.keys(props.ingredients)
		.map(e => {
			return [...Array(props.ingredients[e])].map((_, i)=> {
				return <BurgerIngredient key={e + i} type={e} />;
			});
		})
		.reduce((arr, e) => {
			return arr.concat(e)
		}, []);
	if (ingredients.length === 0) {
		ingredients = <p>Please start adding ingredients</p>
	}
	return (
		<div className={classes.Burger}>
			<BurgerIngredient type="bread-top"/>
			{ingredients}
			<BurgerIngredient type="bread-bottom"/>
		</div>
	);
}
export default burger;
