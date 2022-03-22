export default class SubSystem_Creature
{
    constructor(options)
    {
        this.baseLayout             = options.baseLayout;
        this.creature               = options.creature;
    }

    getCurrentHealth()
    {
        let mHealthComponent = this.baseLayout.getObjectPropertyValue(this.creature, 'mHealthComponent');
            if(mHealthComponent !== null)
            {
                let currentHealthComponent = this.baseLayout.saveGameParser.getTargetObject(mHealthComponent.pathName);
                    if(currentHealthComponent !== null)
                    {
                        let mCurrentHealth = this.baseLayout.getObjectPropertyValue(currentHealthComponent, 'mCurrentHealth');
                            if(mCurrentHealth !== null)
                            {
                                return mCurrentHealth;
                            }
                    }
            }

        return 100;
    }
}