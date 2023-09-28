import { FC } from 'react';
import cx from 'classnames';
import { Button as MantineButton, createStyles } from '@mantine/core';
import { IButton } from './Button.interfaces';

// custom styles for variants
const useStyles = createStyles(
  (theme, { variant, color, primary, secondary, transparent, animate }: IButton) => ({
    root: {
      display: 'flex',
      fontWeight: 'normal',
      
      ...(!animate ? { ':active': { transform: 'none' } }: {}),
      ...(transparent
        ? {
            ':hover': {
              backgroundColor: 'transparent',
            },
          }
        : {}),
      ...(variant === 'outline'
        ? {
            color: primary
              ? theme.colors[theme.primaryColor][
                  theme.colorScheme === 'light' ? 6 : 8
                ]
              : theme.colors[color][theme.colorScheme === 'light' ? 6 : 0],
            borderColor: primary
              ? theme.colors[theme.primaryColor][
                  theme.colorScheme === 'light' ? 6 : 8
                ]
              : theme.colors[theme.colorScheme === 'light' ? 'gray' : color][4],
            ':hover': {
              ...(primary ? { color: theme.white } : {}),
              backgroundColor: primary
                ? theme.colors[theme.primaryColor][
                    theme.colorScheme === 'light' ? 7 : 9
                  ]
                : theme.colors[theme.colorScheme === 'light' ? 'gray' : color][
                    theme.colorScheme === 'light' ? 3 : 5
                  ],
            },
          }
        : {}),
      // same color for both light/dark color variant
      ...(secondary
        ? {
            color: theme.white,
            backgroundColor: theme.colors.dark[4],
            ':hover': {
              backgroundColor: theme.colors.dark[5],
            },
          }
        : {}),
      '&:disabled, &[data-disabled]': {
        ...(transparent || ['subtle'].includes(variant)
          ? {
              color: primary
                ? theme.colors[theme.primaryColor][
                    theme.colorScheme === 'light' ? 6 : 8
                  ]
                : theme.colors[color][theme.colorScheme === 'light' ? 6 : 0],
              backgroundColor: 'transparent',
            }
          : {}),
        ...(variant === 'filled'
          ? {
              color: theme.white,
              backgroundColor: primary
                ? theme.colors[theme.primaryColor][
                    theme.colorScheme === 'light' ? 6 : 8
                  ]
                : theme.colors[color][theme.colorScheme === 'light' ? 6 : 8],
            }
          : {}),
        ...(variant === 'outline'
          ? {
              color: primary
                ? theme.colors[theme.primaryColor][
                    theme.colorScheme === 'light' ? 6 : 8
                  ]
                : theme.colors[color][theme.colorScheme === 'light' ? 6 : 0],
              borderColor: primary
                ? theme.colors[theme.primaryColor][
                    theme.colorScheme === 'light' ? 6 : 8
                  ]
                : theme.colors[
                    theme.colorScheme === 'light' ? 'gray' : color
                  ][4],
            }
          : {}),
        ...(secondary
          ? {
              color: theme.white,
              backgroundColor: theme.colors.dark[4],
            }
          : {}),
      },
    },
    leftIcon: {
      paddingLeft: 'calc(0.875rem  / 1.5)',
      paddingRight: 'calc(0.875rem  / 1.5)',
    },
  })
);

enum EVariant {
  primary = 'filled',
  ghost = 'subtle',
  outline = 'outline',
}
enum ESize {
  xs = 'xs',
  sm = 'sm',
  md = 'md',
  lg = 'lg',
}

const Button: FC<IButton> = ({
  children,
  classNames = {},
  size,
  variant,

  primary = false,
  ghost = false,
  secondary = false,
  danger = false,
  transparent = false,
  outline = false,

  xs = false,
  sm = false,
  md = false,
  lg = false,

  text,
  animate = true,
  ...props
}) => {
  // default variant if not passed is primary
  const customVariant =
    ((danger || secondary) && EVariant.primary) ||
    ((ghost || transparent) && EVariant.ghost) ||
    (outline && EVariant.outline) ||
    variant;

  // default size if not passed is sm
  const customSize =
    (xs && ESize.xs) ||
    (sm && ESize.sm) ||
    (md && ESize.md) ||
    (lg && ESize.lg) ||
    size;

  // default size if not passed is sm
  const customColor = danger ? 'red' : primary ? 'primaryColor' : 'dark';
  const { classes } = useStyles({
    variant: customVariant ?? 'filled',
    color: customColor,
    primary,
    secondary,
    transparent,
    animate
  });

  return (
    <MantineButton
      size={customSize}
      variant={customVariant}
      color={customColor}
      classNames={{
        ...classNames,
        root: cx(
          classNames.root,
          classes.root,
          {
            'justify-center': props.fullWidth && !props.leftIcon,
          },
          {
            [classes.leftIcon]: !text,
          }
        ),
        leftIcon: cx(classNames.leftIcon, {
          'mr-0': !text,
        }),
      }}
      {...props}
    >
      {text ?? children}
    </MantineButton>
  );
};
export default Button;
