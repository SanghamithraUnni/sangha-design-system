import React from 'react';
import {it,expect} from 'vitest';
import {render,screen} from '@testing-library/react';
import {Icon,IconButton} from '../src/components';
it('renders all existing aliases as decorative Phosphor glyphs',()=>{
 const aliases=['arrow','external','check','close','plus','chevron','more','send','save',
  'book','books','calendar','review','heart','sparkle','tag','target','trophy','profile','people','list','quote','search','star'];
 const{container}=render(<>{aliases.map(name=><Icon key={name} name={name}/>)}</>);
 const glyphs=container.querySelectorAll('svg');expect(glyphs).toHaveLength(aliases.length);
 for(const glyph of glyphs){expect(glyph).toHaveAttribute('aria-hidden','true');expect(glyph).toHaveAttribute('focusable','false');expect(glyph.querySelector('path')).not.toBeNull();}
 expect(screen.queryByRole('img')).not.toBeInTheDocument();
});
it('keeps icon buttons labelled and safely ignores an unknown alias',()=>{
 const{container}=render(<><IconButton label="Save draft" icon="save"/><Icon name="not-a-real-alias"/></>);
 expect(screen.getByRole('button',{name:'Save draft'})).toBeInTheDocument();expect(container.querySelectorAll('svg')).toHaveLength(1);
});
