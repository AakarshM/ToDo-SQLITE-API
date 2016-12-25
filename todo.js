/**
 * Created by Aakarsh on 12/24/16.
 */

module.exports = function (sequelize, DataTypes) {  //Passed in data-types

    //RETURN THE VAR of the TYPE OF TODOS POSSIBLE -- SEE /playground

    return sequelize.define('todo', {

        description:{
            type: DataTypes.STRING,
            validate:{
                //notEmpty: true  <-- desc. cannot be empty
                len: [1, 250]  //<-- length of desc from 1 to 250 chars.

            }
        },
        completed:{
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            validate:{
                notEmpty: true
            }
        }

    });

};