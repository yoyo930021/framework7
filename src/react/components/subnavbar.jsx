import React, { forwardRef, useRef, useImperativeHandle } from 'react';
import { classNames, getDataAttrs } from '../utils/utils';
import { colorClasses } from '../utils/mixins';

/* dts-props
  id?: string | number;
  className?: string;
  style?: React.CSSProperties;
  sliding? : boolean
  title? : string
  inner? : boolean
  COLOR_PROPS
*/

const Subnavbar = forwardRef((props, ref) => {
  const { className, id, style, children, inner = true, title, sliding } = props;
  const dataAttrs = getDataAttrs(props);

  const elRef = useRef(null);
  useImperativeHandle(ref, () => ({
    el: elRef.current,
  }));

  const classes = classNames(
    className,
    'subnavbar',
    {
      sliding,
    },
    colorClasses(props),
  );
  return (
    <div className={classes} id={id} style={style} ref={elRef} {...dataAttrs}>
      {inner ? (
        <div className="subnavbar-inner">
          {title && <div className="subnavbar-title">{title}</div>}
          {children}
        </div>
      ) : (
        { children }
      )}
    </div>
  );
});

Subnavbar.displayName = 'f7-subnavbar';

export default Subnavbar;
