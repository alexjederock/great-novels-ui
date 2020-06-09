import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import { describe, it } from 'mocha'
import Novel from '../../components/Novel'

describe('Components - Novel', () => {
  it('displays the novel with its title and author name', () => {
    const wrapper = shallow(<Novel id={1} title="Dracula" nameFirst="Bram" nameLast="Stoker" />)

    expect(wrapper.text()).to.equal('Dracula by Bram Stoker')
  })
})
