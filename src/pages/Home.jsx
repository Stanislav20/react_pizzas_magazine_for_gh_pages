import { useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// useSelector вытаскивает данные из хранилища
// useDispatch вполняет действия, в данном случает меняет категорию пицц и меняет сортировку пиицц

import Categories from '../components/Categories';
import Sort from '../components/Sort';
import PizzaBlock from '../components/pizzaBlock/index';
import PizzaSkeleton from '../components/pizzaBlock/PizzaSkeleton';
import { SearchContext } from '../App';
import { setActiveIndexCategory, setSelectedSort } from '../redux/slices/filterSlice';
import { fetchPizzas } from '../redux/slices/pizzasSlice';

function Home() {
	const dispatch = useDispatch()
	const { searchValue } = useContext(SearchContext)
	const { items, status } = useSelector((state) => state.pizzasReducer)

	const getPizzas = async () => {
		const sortBy = selectedSort.sortProperty.replace('-', '');
		const order = selectedSort.sortProperty.includes('-') ? 'asc' : 'desc';
		const category = activeIndexCategory > 0 ? `category=${activeIndexCategory}` : '';

		dispatch(fetchPizzas({
			sortBy,
			order,
			category,
		}))
		window.scroll(0, 0)
	}

	const activeIndexCategory = useSelector((state) => state.filterReducer.activeIndexCategory)
	const dispatchFilterPizzas = useDispatch()
	const onClickCategory = (index) => {
		dispatchFilterPizzas(setActiveIndexCategory(index))
	}

	const selectedSort = useSelector((state) => state.filterReducer.selectedSort)
	const dispatchSortPizzas = useDispatch()
	const onClickSort = (obj) => {
		dispatchSortPizzas(setSelectedSort(obj))
	}

	useEffect(() => {
		getPizzas()
	}, [activeIndexCategory, selectedSort])
  
		const pizzas = items
		.filter(obj => obj.title.toLowerCase().includes(searchValue.toLowerCase()))
		.map((obj) => (<PizzaBlock key={obj.id} {...obj} />))	

	const skeletons = [...new Array(6)].map((_, i) => <PizzaSkeleton key={i} />)

	return (
		<div className="container">
			<div className="content__top">
				<Categories 
				  activeIndexCategory={activeIndexCategory} 
					onClickCategory={onClickCategory} />
				<Sort  
				  selectedSort={selectedSort} 
					onClickSort={onClickSort} />
			</div>
			<h2 className="content__title">Все пиццы</h2>
			{status === 'error'
				? (<div className='content__error'>
						<h2>Произошла ошибка 😕</h2>
						<p>К сожалению не удалось загрузить пиццы. Повторите попытку позже</p>
					</div>
				) : (<div className="content__items">{status === 'loading' ? skeletons : pizzas}</div>)
			}   
		</div>
	)
}

export default Home