import { type FC, useEffect, useMemo, useState } from 'react'

import {
	ActionIcon,
	Checkbox,
	CloseIcon,
	Group,
	Stack,
	TextInput,
	Title,
	Tooltip,
} from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'

import {
	IconArrowBack,
	IconArrowBackUp,
	IconChevronLeft,
	IconChevronRight,
} from '@tabler/icons-react'
import { addDays, format, isSameYear, isToday } from 'date-fns'
import {
	parseAsArrayOf,
	parseAsIsoDate,
	parseAsString,
	useQueryState,
} from 'nuqs'
import randomSeed from 'random-seed'

import '@mantine/dates/styles.layer.css'
import styles from './Index.module.css'

export const IndexView: FC = () => {
	const today = new Date()

	const [selectedDate, setSelectedDate] = useQueryState<Date>(
		'd',
		parseAsIsoDate.withDefault(today),
	)

	const [variants, setVariants] = useQueryState<string[]>(
		'v',
		parseAsArrayOf(parseAsString).withDefault([]),
	)
	const [selected, setSelected] = useQueryState<string[]>(
		's',
		parseAsArrayOf(parseAsString).withDefault([]),
	)

	const [addInput, setAddInput] = useState('')

	const selectedElement = useMemo(() => {
		const sorted = selected.sort()
		const seed = [format(selectedDate, 'dd-MM-yyyy'), ...sorted].join(' ')
		// eslint-disable-next-line import-x/no-named-as-default-member -- CJS+Vite incompatible
		const random = randomSeed.create(seed).random()
		const index = Math.floor(random * selected.length)
		return sorted[index]
	}, [selected, selectedDate])

	useEffect(() => {
		void setSelected(prevState =>
			prevState.filter(item => variants.includes(item)),
		)
	}, [setSelected, variants])

	return (
		<Stack className={styles.root} justify='center'>
			<Group>
				<Tooltip label='Previous day'>
					<ActionIcon
						variant='subtle'
						onClick={() => {
							void setSelectedDate(prevState =>
								addDays(prevState, -1),
							)
						}}
					>
						<IconChevronLeft />
					</ActionIcon>
				</Tooltip>
				<DatePickerInput
					placeholder='Pick date'
					className={styles.date}
					value={selectedDate}
					onChange={value => {
						if (value !== null)
							void setSelectedDate(new Date(value))
					}}
					// valueFormat='MMM D'
					valueFormatter={({ date }) =>
						date === null || Array.isArray(date)
							? ''
							: isToday(selectedDate)
								? 'Today'
								: format(
										date,
										isSameYear(selectedDate, today)
											? 'MMM d'
											: "MMM d ''yy",
									)
					}
					rightSection={
						<Tooltip label='Today'>
							<ActionIcon
								variant='filled'
								style={{
									visibility: isToday(selectedDate)
										? 'hidden'
										: undefined,
								}}
								onClick={() => setSelectedDate(today)}
							>
								<IconArrowBackUp />
							</ActionIcon>
						</Tooltip>
					}
				/>
				<Tooltip label='Next day'>
					<ActionIcon
						variant='subtle'
						onClick={() =>
							setSelectedDate(prevState => addDays(prevState, 1))
						}
					>
						<IconChevronRight />
					</ActionIcon>
				</Tooltip>
			</Group>
			<Title className={styles.title}>
				<strong>{selectedElement ?? '–'}</strong>
			</Title>
			<div>
				{variants.map(variant => (
					<Group key={variant}>
						<Checkbox
							label={variant}
							className={styles.checkbox}
							classNames={{
								body: styles.checkboxBody,
								labelWrapper: styles.checkboxLabelWrapper,
								label: styles.checkboxLabel,
							}}
							checked={selected.includes(variant)}
							onChange={({ currentTarget: { checked } }) =>
								setSelected(prevState =>
									checked
										? [...prevState, variant]
										: prevState.filter(v => v !== variant),
								)
							}
						/>
						<Tooltip label='Remove variant' position='right'>
							<ActionIcon
								variant='subtle'
								color='red'
								size='sm'
								onClick={() =>
									setVariants(prevState =>
										prevState.filter(v => v !== variant),
									)
								}
							>
								<CloseIcon />
							</ActionIcon>
						</Tooltip>
					</Group>
				))}
			</div>
			<form
				onSubmit={event => {
					event.preventDefault()
					void setVariants(prevState => [...prevState, addInput])
					setAddInput('')
				}}
			>
				<TextInput
					placeholder='Add variant'
					value={addInput}
					onChange={({ currentTarget: { value } }) => {
						setAddInput(value)
					}}
					rightSection={
						<Tooltip label='Add' position='right'>
							<ActionIcon
								variant='subtle'
								color='inherit'
								type='submit'
								style={{
									visibility:
										addInput === '' ? 'hidden' : undefined,
								}}
							>
								<IconArrowBack />
							</ActionIcon>
						</Tooltip>
					}
				/>
			</form>
		</Stack>
	)
}
