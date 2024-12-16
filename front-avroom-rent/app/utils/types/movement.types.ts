export interface IMovement {
    id: string;
    deviceId: string;
    userId: string;
    type: "loan" | "return";
    description: string;
    loanDate: Date;
    returnDateExpected: Date;
    returnDateActual?: Date;
    loanStatus: "active" | "completed";
  }
  
  export interface IMovementWithUsername extends IMovement {
    username: string;
  }  