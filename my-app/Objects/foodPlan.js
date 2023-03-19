function foodPlan() {
    this.food = ""
    this.units = ""
    this.dosingPerWeek = []
    this.dosingAfter = false
    this.days = [false, false, false, false, false, false, false]
    this.timeSpecified = false
    this.time = null
}

export default foodPlan