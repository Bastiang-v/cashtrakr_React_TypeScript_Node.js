import { Table, Column, Model, DataType, HasMany, BelongsTo, ForeignKey, AllowNull } from 'sequelize-typescript'
@Table({
    tableName: 'budgets'
})

class Budget extends Model {
    @AllowNull(false)
    @Column({
        type: DataType.STRING(100)
    })
    declare name: string

    @AllowNull(false)
    @Column({
        type: DataType.DECIMAL
    })
    declare amount: number
}

export default Budget
