import { Entity } from "typeorm";
import { ParentEntity } from "../../auth/entities/parent.entity";

@Entity({name: 'games'})
export class GameEntity extends ParentEntity {

}